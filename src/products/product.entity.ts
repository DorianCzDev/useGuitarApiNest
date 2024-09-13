import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({
    enum: ['guitar', 'amp', 'pickup', 'multi effect'],
    nullable: false,
  })
  category: string;

  @Column({ nullable: false })
  price: number;
}
