import { OrderProducts } from '../orders/order-products.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
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
    enum: ['guitar', 'amplifier', 'pickup', 'multi effect'],
  })
  category: string;

  @Column({ default: 50, name: 'regular_price' })
  regularPrice: number;

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

  @Column({ length: 2000 })
  description: string;
  //guitar

  @Column({ nullable: true, length: 40 })
  body: string;

  @Column({ nullable: true, length: 40 })
  neck: string;

  @Column({ name: 'bridge_pickup', length: 40, nullable: true })
  bridgePickup: string;

  @Column({ name: 'middle_pickup', length: 40, nullable: true })
  middlePickup: string;

  @Column({ name: 'neck_pickup', length: 40, nullable: true })
  neckPickup: string;

  @Column({ name: 'frets_number', nullable: true })
  fretsNumber: number;

  @Column({ name: 'left_handed', nullable: true })
  leftHanded: boolean;

  @Column({ name: 'strings_number', nullable: true })
  stringsNumber: number;

  @Column({
    type: 'enum',
    enum: ['H', 'HH', 'HHH', 'S', 'SS', 'SSS', 'HS', 'HHS'],
    nullable: true,
  })
  pickups: string;

  @Column({ nullable: true })
  tremolo: boolean;

  @Column({ name: 'pickups_active', nullable: true })
  pickupsActive: boolean;

  @Column({
    type: 'enum',
    enum: ['humbucker', 'single coil', 'mixed'],
    nullable: true,
    name: 'pickups_type',
  })
  pickupsType: string;

  //amp

  @Column({ nullable: true })
  speakers: string;

  @Column({ nullable: true })
  power: number;

  @Column({ type: 'real', nullable: true })
  weight: number;

  @Column({ name: 'foot_switch_connection', nullable: true })
  footSwitchConnection: boolean;

  @Column({ nullable: true })
  channels: number;

  @Column({ name: 'memory_slots', nullable: true })
  memorySlots: number;

  @Column({ name: 'headphone_output', nullable: true })
  headphoneOutput: boolean;

  @Column({ name: 'effects_processor', nullable: true })
  effectProcessor: boolean;

  @Column({ name: 'recording_output', nullable: true })
  recordingOutput: boolean;

  @Column({ nullable: true })
  reverb: boolean;

  @Column({ name: 'line_input', nullable: true })
  lineInput: number;

  //pickup

  @Column({ name: 'pickup_strings_number', nullable: true })
  pickupStringsNumber: number;

  @Column({ nullable: true })
  active: boolean;

  @Column({ type: 'enum', enum: ['high', 'medium', 'low'], nullable: true })
  output: string;

  @Column({ nullable: true })
  kappe: boolean;

  @Column({ nullable: true })
  wiring: number;

  @Column({ type: 'enum', enum: ['humbucker', 'single coil'], nullable: true })
  pickup: string;

  //multi effect

  @Column({ name: 'aux_port', nullable: true })
  auxPort: boolean;

  @Column({ name: 'usb_port', nullable: true })
  usePort: boolean;

  @Column({ nullable: true })
  effects: boolean;

  @Column({ name: 'amp_modeling', nullable: true })
  ampModeling: boolean;

  @Column({ name: 'drum_computer', nullable: true })
  drumComputer: boolean;

  @Column({ default: false, name: 'is_featured' })
  isFeatured: boolean;

  @OneToMany(() => Images, (image) => image.product, { eager: true })
  images: Images[];

  @OneToMany(() => Reviews, (review) => review.product)
  reviews: Reviews[];

  @OneToMany(() => OrderProducts, (order) => order.product)
  @JoinColumn({ name: 'order_products' })
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
        this.regularPrice - this.regularPrice * (this.discount / 100);
      this.price = Math.ceil(price);
    } else {
      const price = this.regularPrice;
      this.price = Math.ceil(price);
    }
  }
}
