import { Reviews } from '../reviews/reviews.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    nullable: false,
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
