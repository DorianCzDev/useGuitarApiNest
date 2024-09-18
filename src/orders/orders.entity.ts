import { Users } from 'src/users/users.entity';
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

  @Column({ nullable: true })
  clientSecret: string;

  @Column({ nullable: true })
  paymentIntentId: string;

  @Column()
  deliveryMethod: string;

  @Column()
  deliveryCost: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @OneToMany(() => OrderProducts, (product) => product.order, { eager: true })
  orderProducts: OrderProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
