import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Products } from './products.entity';
import { GetAllProductsDto } from './dto/get-all-products.dto';
import featureToArray from 'src/utils/featureToArray';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Products) private repo: Repository<Products>) {}

  async create(productDto: CreateProductDto) {
    const isExist = await this.repo.findOneBy({ name: productDto.name });
    if (isExist) {
      throw new BadRequestException('Product name must be unique.');
    }
    const product = this.repo.create(productDto);
    return this.repo.save(product);
  }

  async getAll(query: Partial<GetAllProductsDto>) {
    let { sort, page } = query;

    delete query.sort;
    delete query.page;

    const result = this.repo
      .createQueryBuilder('products')
      .select('products.*')
      .addSelect('COUNT("productId")', 'reviews_number')
      .addSelect('AVG(rating)', 'avg_rating')
      .leftJoin('reviews', 'reviews', 'products.id = "productId"')
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

    const limit = 12;

    const currPage = parseInt(page) || 1;

    const offset = (currPage - 1) * limit;

    result.offset(offset).limit(limit);

    const count = await result.getCount();

    let productsBody = [];
    let productsNeck = [];

    if (query.category === 'guitar') {
      const products = await result.getRawMany();
      productsBody = featureToArray(products, 'body');
      productsNeck = featureToArray(products, 'neck');
    }

    return result.getRawMany();
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
}
