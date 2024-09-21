import { Products } from 'src/products/products.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './orders.entity';

@Entity()
export class OrderProducts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Products, (product) => product.orderProducts)
  product: number;

  @ManyToOne(() => Orders, (order) => order.orderProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: number;
}
