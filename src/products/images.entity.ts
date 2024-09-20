import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Products } from './products.entity';

@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cloudinary_image_id: string;

  @Column({ default: '/example.png', length: 200 })
  image_url: string;

  @ManyToOne(() => Products, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Products;
}
