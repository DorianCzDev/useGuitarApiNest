import { Reviews } from '../reviews/reviews.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
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
  @Column({ unique: true, nullable: false, length: 50 })
  name: string;

  @Column({
    type: 'enum',
    enum: ['guitar', 'amp', 'pickup', 'multi effect'],
    nullable: false,
  })
  category: string;

  @Column({ nullable: false })
  price: number;

  @Column({ default: false })
  stock: boolean;

  @Column({ nullable: true })
  body: string;

  @Column({ nullable: true })
  neck: string;

  @OneToMany(() => Reviews, (review) => review.product)
  reviews: Reviews[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
