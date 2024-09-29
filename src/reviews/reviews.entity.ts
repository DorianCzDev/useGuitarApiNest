import { Users } from '../users/users.entity';
import { Products } from '../products/products.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Check('"rating" > 0 AND "rating" <= 5 ')
export class Reviews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 1000 })
  comment: string;

  @Column({ nullable: false })
  rating: number;

  @Column({ name: 'is_reported' })
  isReported: boolean;

  @ManyToOne(() => Products, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: number;

  @ManyToOne(() => Users, (user) => user.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
