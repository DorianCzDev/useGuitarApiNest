import { Orders } from '../orders/orders.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reviews } from '../reviews/reviews.entity';
const countries = require('../utils/countries');

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ name: 'first_name', length: 40, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 40, nullable: true })
  lastName: string;

  @Column({ name: 'post_code', length: 10, nullable: true })
  postCode: string;

  @Column({ length: 40, nullable: true })
  address: string;

  @Column({ length: 40, nullable: true })
  city: string;

  @Column({
    type: 'enum',
    enum: countries,
    nullable: true,
  })
  country: string;

  @Column({ name: 'phone_number', length: 20, nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'admin',
  })
  role: string;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  forgotPasswordToken: string;

  @Column({ nullable: true })
  forgotPasswordTokenExpirationDate: Date;

  @OneToMany(() => Reviews, (review) => review.user)
  reviews: Reviews[];

  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
