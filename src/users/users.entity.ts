import { Orders } from 'src/orders/orders.entity';
import { Reviews } from '../reviews/reviews.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'admin',
  })
  role: string;

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
