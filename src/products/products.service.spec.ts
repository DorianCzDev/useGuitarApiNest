import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Products } from './products.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const products: Products[] = [];
    const mockProductsRepo = {
      findOneBy: ({ name }) => {
        const filteredProduct = products.map((Product) => {
          if (Product.name === name) {
            return Product;
          }
        });
        if (filteredProduct.length === 0) {
          return Promise.resolve(null);
        }
        return Promise.resolve(filteredProduct[0]);
      },
      create: (productDto: Partial<CreateProductDto>) => {
        const product = {
          id: Math.floor(Math.random() * 999999),
          name: productDto.name,
          price: productDto.price,
          category: productDto.category,
        } as Products;
        products.push(product);
        return Promise.resolve(product);
      },
      save: (user: Partial<Products>) => {
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Products), useValue: mockProductsRepo },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns a created product', async () => {
    const productDto = {
      name: 'test',
      price: 153,
      category: 'guitar',
    };
    const product = await service.create(productDto);

    expect(product).toBeDefined();
  });

  it('throws an error if admin create product with name that is already exist', async () => {
    const productDto = {
      name: 'test',
      price: 153,
      category: 'guitar',
    };
    await service.create(productDto);
    await expect(service.create(productDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if product was not found', async () => {
    await expect(service.getByName('name')).rejects.toThrow(NotFoundException);
  });
});
