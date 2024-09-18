import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
