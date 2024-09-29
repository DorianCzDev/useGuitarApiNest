import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import featureToArray from '../utils/featureToArray';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsDto } from './dto/get-all-products.dto';
import { Images } from './images.entity';
import { Products } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products) private repo: Repository<Products>,
    @InjectRepository(Images) private imagesRepo: Repository<Images>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(productDto: CreateProductDto, images: Express.Multer.File[]) {
    const isExist = await this.repo.findOneBy({ name: productDto.name });
    if (isExist) {
      throw new BadRequestException('Product name must be unique.');
    }
    const product = this.repo.create(productDto);

    const maxSize = 1024 * 1024 * 2; //2Mb

    let occuringError: string;
    if (images.length > 1) {
      for (const image of images) {
        if (!image.mimetype.startsWith('image')) {
          occuringError = 'Please upload image';
        }
        if (image.size > maxSize) {
          occuringError = 'Please upload image smaller than 2Mb';
        }
      }
    } else if (images.length === 1) {
      if (!images[0].mimetype.startsWith('image')) {
        occuringError = 'Please upload image';
      }
      if (images[0].size > maxSize) {
        occuringError = 'Please upload image smaller than 2Mb';
      }
    }
    if (occuringError) {
      await this.repo.remove(product);
      throw new BadRequestException(occuringError);
    }

    await this.repo.save(product);

    if (images.length > 1) {
      for (const image of images) {
        const imageResult = await this.cloudinaryService.uploadFile(image);

        const newImage = this.imagesRepo.create({
          cloudinary_image_id: imageResult.public_id,
          image_url: imageResult.secure_url,
          product: product,
        });

        await this.imagesRepo.save(newImage);
      }
    } else if (images.length === 1) {
      const imageResult = await this.cloudinaryService.uploadFile(images[0]);
      const newImage = this.imagesRepo.create({
        cloudinary_image_id: imageResult.public_id,
        image_url: imageResult.secure_url,
        product: product,
      });

      await this.imagesRepo.save(newImage);
    }

    return product;
  }

  async getAll(query: Partial<GetAllProductsDto>) {
    let { sort, page } = query;

    if (query.category === 'multi effects') {
      query.category = 'multi effect';
    }

    delete query.sort;
    delete query.page;

    const result = this.repo
      .createQueryBuilder('products')
      .select('products.*')
      .addSelect('COUNT("product_id")', 'reviews_number')
      .addSelect('AVG(rating)', 'avg_rating')
      .addSelect('jsonb_agg(images.*)', 'images')
      .leftJoin('reviews', 'reviews', 'products.id = reviews.product_id')
      .innerJoin('images', 'images', 'products.id = "productId"')
      .groupBy('products.id');

    let queryEntries = Object.entries(query);

    let queryArray = [];

    queryEntries.map((arrayEl: string[] | boolean) => {
      if (arrayEl[1].includes('true')) {
        arrayEl[1] = true;
      } else if (arrayEl[1].includes('false')) {
        arrayEl[1] = false;
      }
      queryArray = [...queryArray, [arrayEl[0], arrayEl[1]]];
    });

    const queryObjectFromArray = queryArray.map((array) => {
      const [key, value] = array;
      const obj = {
        [key]: value,
      };
      return obj;
    });

    for (let obj of queryObjectFromArray) {
      const [array] = Object.entries(obj);
      let [key, value] = array;
      if (key.includes('min')) {
        if (key.includes('price')) {
          value = value * 100;
        }
        const field = key.split('-')[1];
        result.andWhere(`${field} >= :${value}`, { [value]: parseInt(value) });
      } else if (key.includes('max')) {
        if (key.includes('price')) {
          value = value * 100;
        }
        const field = key.split('-')[1];
        result.andWhere(`${field} <= :${value}`, { [value]: parseInt(value) });
      } else if (key === 'name') {
        result.andWhere(`${key} ~ :${key}`, { [key]: value });
      } else {
        result.andWhere(`${key} = :${key}`, { [key]: value });
      }
    }

    if (sort) {
      const order = sort.includes('-') ? 'DESC' : 'ASC';
      if (sort.includes('-')) {
        sort = sort.substring(1);
      }
      result.orderBy(sort, order);
    } else {
      result.orderBy('products.created_at');
    }

    let productsBody = [];
    let productsNeck = [];

    if (query.category === 'guitar') {
      const products = await result.getRawMany();
      productsBody = featureToArray(products, 'body');
      productsNeck = featureToArray(products, 'neck');
    }
    const limit = query.category ? 12 : 10;

    const currPage = parseInt(page) || 1;

    const offset = (currPage - 1) * limit;

    result.offset(offset).limit(limit);

    const productsCount = await result.getCount();

    const products = await result.getRawMany();

    return { products, productsCount, productsBody, productsNeck };
  }

  async getByName(name: string) {
    const result = this.repo
      .createQueryBuilder('products')
      .select('products.*')
      .addSelect('COUNT("product_id")', 'reviews_number')
      .addSelect('AVG(rating)', 'avg_rating')
      .addSelect('jsonb_agg(images.*)', 'images')
      .leftJoin('reviews', 'reviews', 'products.id = reviews.product_id')
      .innerJoin('images', 'images', 'products.id = "productId"')
      .groupBy('products.id');

    result.where(`name = '${name}'`);

    return result.getRawOne();
  }

  async getByNamePanel(name: string) {
    const product = await this.repo.findOneBy({ name });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: number,
    body: Partial<CreateProductDto>,
    images: Array<Express.Multer.File>,
  ) {
    const product = await this.repo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    Object.assign(product, body);
    await this.repo.save(product);
    if (!images) {
      return product;
    }

    const maxSize = 1024 * 1024 * 2; //2Mb

    let occuringError: string;
    if (images.length > 1) {
      for (const image of images) {
        if (!image.mimetype.startsWith('image')) {
          occuringError = 'Please upload image';
        }
        if (image.size > maxSize) {
          occuringError = 'Please upload image smaller than 2Mb';
        }
      }
    } else if (images.length === 1) {
      if (!images[0].mimetype.startsWith('image')) {
        occuringError = 'Please upload image';
      }
      if (images[0].size > maxSize) {
        occuringError = 'Please upload image smaller than 2Mb';
      }
    }
    if (occuringError) {
      await this.repo.remove(product);
      throw new BadRequestException(occuringError);
    }

    if (images.length > 1) {
      for (const image of images) {
        const imageResult = await this.cloudinaryService.uploadFile(image);

        const newImage = this.imagesRepo.create({
          cloudinary_image_id: imageResult.public_id,
          image_url: imageResult.secure_url,
          product: product,
        });

        await this.imagesRepo.save(newImage);
      }
    } else if (images.length === 1) {
      const imageResult = await this.cloudinaryService.uploadFile(images[0]);
      const newImage = this.imagesRepo.create({
        cloudinary_image_id: imageResult.public_id,
        image_url: imageResult.secure_url,
        product: product,
      });

      await this.imagesRepo.save(newImage);
    }

    return product;
  }

  async remove(id: number) {
    const product = await this.repo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.repo.remove(product);
  }

  async getCartProducts(id: string) {
    if (!id) {
      return;
    }
    const idArray = id.split('-');
    let products = [];
    for (const id of idArray) {
      let product = await this.repo.findOneBy({ id: parseInt(id) });
      const image = await this.imagesRepo
        .createQueryBuilder('images')
        .select('images.*')
        .where('"productId" = :id', { id: id })
        .getRawOne();

      const { name, category, price } = product;
      const cartProduct = {
        id,
        name,
        category,
        price,
        image: image.image_url,
        quantity: 1,
      };
      products = [...products, cartProduct];
    }
    return products;
  }

  async deleteImage(name: string, publicId: string) {
    if (!publicId) {
      throw new BadRequestException('Please provide all required values');
    }
    const product = await this.repo.findOneBy({ name });

    if (!product) {
      throw new NotFoundException(
        `No image with publicId: ${publicId} related to product: ${name}`,
      );
    }

    if (product.images.length === 1) {
      throw new BadRequestException(
        'Each product must have at least one image related to it.',
      );
    }

    let imageIndex: number;
    for (const [index, image] of product.images.entries()) {
      if (image.cloudinary_image_id === publicId) imageIndex = index;
    }
    if (imageIndex === -1 || imageIndex === undefined) {
      throw new NotFoundException(
        `No image with publicId: ${publicId} related to product: ${name}`,
      );
    }
    product.images.splice(imageIndex, 1);

    await this.repo.save(product);

    const imageDb = await this.imagesRepo.findOneBy({
      cloudinary_image_id: publicId,
    });

    await this.imagesRepo.remove(imageDb);

    await this.cloudinaryService.deleteFile(publicId);

    return product;
  }

  async changeInventory(name: string, operation: string, quantity: number) {
    const product = await this.repo.findOneBy({ name });
    if (operation === 'add') {
      product.inventory = product.inventory + quantity;
    } else if (operation === 'remove') {
      product.inventory = product.inventory - quantity;
    }
    if (product.inventory < 0) {
      product.inventory = 0;
    }

    return this.repo.save(product);
  }
}
