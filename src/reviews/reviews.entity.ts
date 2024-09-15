import { Products } from 'src/products/products.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ default: false })
  is_reported: boolean;

  @ManyToOne(() => Products, (product) => product.reviews, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  product: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
