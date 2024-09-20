import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FindOptionsUtils, Repository } from 'typeorm';
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

    // if edit
    if (!images) {
      return this.repo.save(product);
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

    delete query.sort;
    delete query.page;

    const result = this.repo
      .createQueryBuilder('products')
      .select('products.*')
      .addSelect('COUNT("product_id")', 'reviews_number')
      .addSelect('AVG(rating)', 'avg_rating')
      .leftJoin('reviews', 'reviews', 'products.id = reviews.product_id')
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
      const [key, value] = array;
      if (key.includes('min')) {
        const field = key.split('-')[1];
        result.andWhere(`${field} >= :${value}`, { [value]: parseInt(value) });
      } else if (key.includes('max')) {
        const field = key.split('-')[1];
        result.andWhere(`${field} <= :${value}`, { [value]: parseInt(value) });
      } else if (key === 'name') {
        result.andWhere(`${key} ~ :${value}`, { [value]: value });
      } else {
        result.andWhere(`${key} = :${value}`, { [value]: value });
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

    const limit = 10;

    const currPage = parseInt(page) || 1;

    const offset = (currPage - 1) * limit;

    result.offset(offset).limit(limit);

    const productsCount = await result.getCount();

    let productsBody = [];
    let productsNeck = [];

    if (query.category === 'guitar') {
      const products = await result.getRawMany();
      productsBody = featureToArray(products, 'body');
      productsNeck = featureToArray(products, 'neck');
    }

    const products = await result.getRawMany();

    return { products, productsCount };
  }

  async getByName(name: string) {
    const product = await this.repo.findOneBy({ name });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, body: Partial<Products>) {
    const product = await this.repo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    Object.assign(product, body);

    return this.repo.save(product);
  }

  async remove(id: number) {
    const product = await this.repo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.repo.remove(product);
  }

  async getCartProducts(id: string) {
    const idArray = id.split('-');
    let products = [];
    for (const id of idArray) {
      let product = await this.repo.findOneBy({ id: parseInt(id) });
      const { name, category, price } = product;
      const cartProduct = {
        id,
        name,
        category,
        price,
        quantity: 1,
      };
      products = [...products, cartProduct];
    }
    return products;
  }
}
