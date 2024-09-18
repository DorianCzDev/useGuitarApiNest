import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DeliveryMethods {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 40 })
  supplier: string;

  @Column()
  cost: number;

  @Column()
  time: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
