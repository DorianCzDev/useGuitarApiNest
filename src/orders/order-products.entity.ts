import { Products } from 'src/products/products.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Orders } from './orders.entity';

@Entity()
export class OrderProducts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  //   @Column()
  //   image: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Products, (product) => product.orderProducts)
  product: number;

  @ManyToOne(() => Orders, (order) => order.orderProducts, {
    onDelete: 'CASCADE',
  })
  order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
