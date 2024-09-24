import { Transform } from 'class-transformer';
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
import { ToBoolean } from '../../decorators/toBoolean';

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
  @Transform(({ value: v }) => v === 'true' || v === true)
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
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  leftHanded: boolean;

  @IsNumber()
  @IsOptional()
  stringsNumber: number;

  @IsString()
  @IsEnum(['H', 'HH', 'HHH', 'S', 'SS', 'SSS', 'HS', 'HHS'])
  @Transform(({ value }) => {
    if (value === '') return null;
  })
  @IsOptional()
  pickups: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  tremolo: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  pickupsActive: boolean;

  @IsString()
  @IsEnum(['humbucker', 'single coil', 'mixed'])
  @Transform(({ value }) => {
    if (value === '') return null;
  })
  @IsOptional()
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
  @ToBoolean()
  @IsOptional()
  footSwitchConnection: boolean;

  @IsNumber()
  @IsOptional()
  channels: number;

  @IsNumber()
  @IsOptional()
  memorySlots: number;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  headphoneOutput: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  effectProcessor: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  recordingOutput: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  reverb: boolean;

  @IsNumber()
  @IsOptional()
  lineInput: number;

  @IsNumber()
  @IsOptional()
  pickupStringsNumber: number;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  active: boolean;

  @IsString()
  @IsOptional()
  output: string;

  @IsBoolean()
  @ToBoolean()
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
  @ToBoolean()
  @IsOptional()
  auxPort: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  usePort: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  effects: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  ampModeling: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  drumComputer: boolean;
}
