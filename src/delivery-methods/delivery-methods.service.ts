import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryMethods } from './delivery-methods.entity';
import { Repository } from 'typeorm';
import { CreateDeliveryMethodDto } from './dto/create-delivery-mothod.dto';

@Injectable()
export class DeliveryMethodsService {
  constructor(
    @InjectRepository(DeliveryMethods)
    private repo: Repository<DeliveryMethods>,
  ) {}

  async create(createDeliveryDto: CreateDeliveryMethodDto) {
    const deliveryMethod = this.repo.create(createDeliveryDto);
    return this.repo.save(deliveryMethod);
  }

  async getAll() {
    const deliveryMethods = await this.repo.find();
    return deliveryMethods;
  }

  async get(id: number) {
    const deliveryMethod = await this.repo.findOneBy({ id });
    if (!deliveryMethod) {
      throw new NotFoundException('No delivery method found');
    }
    return deliveryMethod;
  }

  async update(id: number, body: Partial<CreateDeliveryMethodDto>) {
    const deliveryMethod = await this.repo.findOneBy({ id });
    if (!deliveryMethod) {
      throw new NotFoundException('No delivery method found');
    }
    Object.assign(deliveryMethod, body);
    return this.repo.save(deliveryMethod);
  }

  async remove(id: number) {
    const deliveryMethod = await this.repo.findOneBy({ id });
    if (!deliveryMethod) {
      throw new NotFoundException('No delivery method found');
    }
    return this.repo.remove(deliveryMethod);
  }
}
