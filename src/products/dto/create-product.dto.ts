import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsEnum(['guitar', 'amplifier', 'pickup', 'multi effect'])
  category: string;

  @IsString()
  @IsEnum([
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
  ])
  subcategory: string;

  @IsNumber()
  @Min(1)
  @Max(100000000)
  regularPrice: number;

  @IsNumber()
  @Min(0)
  @Max(99)
  discount: number;

  @IsNumber()
  @IsOptional()
  inventory: number;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  description: string;

  @IsBoolean()
  @IsOptional()
  isFeatured: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  body: string;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  neck: string;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  bridgePickup: string;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  middlePickup: string;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  neckPickup: string;

  @IsNumber()
  @IsOptional()
  fretsNumber: number;

  @IsBoolean()
  @IsOptional()
  leftHanded: boolean;

  @IsNumber()
  @IsOptional()
  stringsNumber: number;

  @IsString()
  @IsOptional()
  @IsEnum(['H', 'HH', 'HHH', 'S', 'SS', 'SSS', 'HS', 'HHS'])
  pickups: string;

  @IsBoolean()
  @IsOptional()
  tremolo: boolean;

  @IsBoolean()
  @IsOptional()
  pickupsActive: boolean;

  @IsString()
  @IsOptional()
  @IsEnum(['humbucker', 'single coil', 'mixed'])
  pickupsType: string;

  @IsString()
  @IsOptional()
  speakers: string;

  @IsNumber()
  @IsOptional()
  power: number;

  @IsNumber()
  @IsOptional()
  weight: number;

  @IsBoolean()
  @IsOptional()
  footSwitchConnection: boolean;

  @IsNumber()
  @IsOptional()
  channels: number;

  @IsNumber()
  @IsOptional()
  memorySlots: number;

  @IsBoolean()
  @IsOptional()
  headphoneOutput: boolean;

  @IsBoolean()
  @IsOptional()
  effectProcessor: boolean;

  @IsBoolean()
  @IsOptional()
  recordingOutput: boolean;

  @IsBoolean()
  @IsOptional()
  reverb: boolean;

  @IsNumber()
  @IsOptional()
  lineInput: number;

  @IsNumber()
  @IsOptional()
  pickupStringsNumber: number;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsString()
  @IsOptional()
  output: string;

  @IsBoolean()
  @IsOptional()
  kappe: boolean;

  @IsNumber()
  @IsOptional()
  wiring: number;

  @IsEnum(['humbucker', 'single coil'])
  @IsString()
  @IsOptional()
  pickup: string;

  @IsBoolean()
  @IsOptional()
  auxPort: boolean;

  @IsBoolean()
  @IsOptional()
  usePort: boolean;

  @IsBoolean()
  @IsOptional()
  effects: boolean;

  @IsBoolean()
  @IsOptional()
  ampModeling: boolean;

  @IsBoolean()
  @IsOptional()
  drumComputer: boolean;
}
