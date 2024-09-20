import { OrderProducts } from 'src/orders/order-products.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reviews } from '../reviews/reviews.entity';
import { Images } from './images.entity';

@Entity()
@Check('"regular_price" >= 1 AND "regular_price" <= 100000000')
@Check('"discount" >= 0 AND "discount" <= 99')
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

  @Column({ default: 50 })
  regular_price: number;

  @Column({ default: 10 })
  discount: number;

  @Column()
  price: number;

  @Column({ default: 10 })
  inventory: number;

  @Column({
    type: 'enum',
    enum: [
      'electric guitar',
      'classical guitar',
      'bass guitar',
      'acoustic guitar',
      'electric guitar amp',
      'bass guitar amp',
      'acoustic guitar amp',
      'bass guitar pickup',
      'electric guitar pickup',
      'guitar multi effect',
      'bass multi effect',
    ],
  })
  subcategory: string;

  @Column({ default: false })
  is_featured: boolean;

  @Column({ nullable: true, length: 40 })
  body: string;

  @Column({ nullable: true, length: 40 })
  neck: string;

  @OneToMany(() => Images, (image) => image.product, { eager: true })
  images: Images[];

  @OneToMany(() => Reviews, (review) => review.product)
  reviews: Reviews[];

  @OneToMany(() => OrderProducts, (order) => order.product)
  orderProducts: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculatePrice() {
    if (this.discount > 0) {
      const price =
        this.regular_price - this.regular_price * (this.discount / 100);
      this.price = Math.ceil(price);
    } else {
      const price = this.regular_price;
      this.price = Math.ceil(price);
    }
  }
}
