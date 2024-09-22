import { Users } from '../users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderProducts } from './order-products.entity';
const countries = require('../utils/countries');

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column({
    type: 'enum',
    enum: [
      'waiting for payment',
      'waiting for shipment',
      'send',
      'delivered',
      'canceled',
    ],
    default: 'waiting for payment',
  })
  status: string;

  @Column({ nullable: true, length: 140, name: 'client_secret' })
  clientSecret: string;

  @Column({ nullable: true, length: 140, name: 'payment_intent_id' })
  paymentIntentId: string;

  @Column({ length: 40, name: 'delivery_method' })
  deliveryMethod: string;

  @Column({ name: 'delivery_cost' })
  deliveryCost: number;

  @Column({ length: 50 })
  email: string;

  @Column({ name: 'first_name', length: 40 })
  firstName: string;

  @Column({ name: 'last_name', length: 40 })
  lastName: string;

  @Column({ name: 'post_code', length: 10 })
  postCode: string;

  @Column({ length: 40 })
  address: string;

  @Column({ length: 40 })
  city: string;

  @Column({
    type: 'enum',
    enum: countries,
    default: 'Poland',
  })
  country: string;

  @Column({ name: 'phone_number', length: 40 })
  phoneNumber: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @OneToMany(() => OrderProducts, (product) => product.order, { eager: true })
  @JoinColumn({ name: 'order_products' })
  orderProducts: OrderProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
