import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './orders.entity';
import { Repository } from 'typeorm';
import { OrderProducts } from './order-products.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { Products } from '../products/products.entity';
import { DeliveryMethods } from '../delivery-methods/delivery-methods.entity';
import { Users } from '../users/users.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders) private ordersRepo: Repository<Orders>,
    @InjectRepository(OrderProducts)
    private orderProductsRepo: Repository<OrderProducts>,
    @InjectRepository(Products) private productsRepo: Repository<Products>,
    @InjectRepository(DeliveryMethods)
    private deliveryRepo: Repository<DeliveryMethods>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
  ) {}

  async create(createOrderDto: CreateOrderDto, req: Request) {
    let orderItems = [];
    for (const clientProduct of createOrderDto.clientProducts) {
      const product = await this.productsRepo.findOneBy({
        id: clientProduct.productId,
      });
      if (!product) {
        throw new NotFoundException(
          'Something went wrong, please try again later',
        );
      }
      orderItems = [
        ...orderItems,
        { product, quantity: clientProduct.quantity },
      ];
    }

    const deliveryMethod = await this.deliveryRepo.findOneBy({
      supplier: createOrderDto.supplier,
      cost: createOrderDto.deliveryCost,
    });

    if (!deliveryMethod) {
      throw new NotFoundException(
        'Something went wrong, please try again later',
      );
    }

    let serverTotalPrice = deliveryMethod.cost;
    orderItems.map(
      (item) =>
        (serverTotalPrice =
          serverTotalPrice + item.product.price * item.quantity),
    );

    if (serverTotalPrice !== createOrderDto.totalPrice) {
      throw new BadRequestException(
        'Something went wrong, please try again later',
      );
    }

    const user = await this.usersRepo.findOneBy({ id: req.user.id });

    const order = this.ordersRepo.create({
      total: serverTotalPrice,
      userId: req.user.id,
      deliveryMethod: createOrderDto.supplier,
      deliveryCost: createOrderDto.deliveryCost,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      postCode: user.postCode,
      address: user.address,
      city: user.city,
      country: user.country,
      phoneNumber: user.phoneNumber,
    });

    await this.ordersRepo.save(order);

    for (const clientProduct of createOrderDto.clientProducts) {
      const serverProduct = await this.productsRepo.findOneBy({
        id: clientProduct.productId,
      });
      const orderProducts = this.orderProductsRepo.create({
        name: serverProduct.name,
        price: serverProduct.price,
        quantity: clientProduct.quantity,
        order: order.id,
        product: serverProduct.id,
      });
      await this.orderProductsRepo.save(orderProducts);
    }

    return order;
  }

  async getAll(
    page: number,
    id: number | null,
    lastName: string | null,
    email: string | null,
  ) {
    const result = this.ordersRepo
      .createQueryBuilder('orders')
      .select('orders.*')
      .addSelect('jsonb_agg(order_products.*)', 'orderProducts')
      .leftJoin('order_products', 'order_products', 'orders.id = order_id')
      .groupBy('orders.id');

    if (id) {
      result.andWhere(`orders.id = :${id}`, { [id]: id });
    }
    if (lastName) {
      result.andWhere(`orders.last_name ~ :${lastName}`, {
        [lastName]: lastName,
      });
    }
    if (email) {
      result.andWhere(`orders.email ~ :${email}`, { [email]: email });
    }

    const limit = 10;

    const currPage = page || 1;

    const offset = (currPage - 1) * limit;

    result.offset(offset).limit(limit);

    const ordersCount = await result.getCount();

    const orders = await result.getRawMany();

    return { ordersCount, orders };
  }

  async get(id: number, req: Request) {
    const order = await this.ordersRepo.findOneBy({ id });
    if (!order) {
      throw new NotFoundException('No order found');
    }

    if (order.userId === req.user.id || req.user.role === 'admin') {
      return order;
    }
    throw new UnauthorizedException('Invalid Credentials');
  }

  async getByUser(req: Request) {
    const { id } = req.user;

    const orders = await this.ordersRepo.findBy({ userId: id });
    return orders;
  }

  async update(id: number, body: UpdateOrderDto) {
    const order = await this.ordersRepo.findOneBy({ id });
    Object.assign(order, body);
    return this.ordersRepo.save(order);
  }

  // async getStats() {
  //   const date = new Date();
  //   const pastYear = date.getFullYear() - 1;
  //   date.setFullYear(pastYear);
  //   date.setDate(1);

  //   const orders = this.ordersRepo
  //     .createQueryBuilder('orders')
  //     .select('orders.*')
  //     .addSelect('jsonb_agg(order_products.*)', 'orderProducts')
  //     .leftJoin('order_products', 'order_products', 'orders.id = order_id')
  //     .groupBy('orders.id');

  //   return orders.getRawMany();
  // }
}
