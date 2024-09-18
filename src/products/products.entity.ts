import { OrderProducts } from 'src/orders/order-products.entity';
import { Reviews } from '../reviews/reviews.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Check('"price" >= 0 AND "price" <= 1000000')
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true, length: 80 })
  name: string;

  @Column({
    type: 'enum',
    enum: ['guitar', 'amp', 'pickup', 'multi effect'],
  })
  category: string;

  @Column()
  price: number;

  @Column({ default: false })
  stock: boolean;

  @Column({ nullable: true, length: 40 })
  body: string;

  @Column({ nullable: true, length: 40 })
  neck: string;

  @OneToMany(() => Reviews, (review) => review.product)
  reviews: Reviews[];

  @OneToMany(() => OrderProducts, (order) => order.product)
  orderProducts: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
