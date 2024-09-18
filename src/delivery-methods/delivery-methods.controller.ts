import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DeliveryMethodsService } from './delivery-methods.service';
import { CreateDeliveryMethodDto } from './dto/create-delivery-mothod.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('delivery')
export class DeliveryMethodsController {
  constructor(private deliveryMethodsService: DeliveryMethodsService) {}

  @Post()
  @UseGuards(AdminGuard)
  createDeliveryMethod(@Body() body: CreateDeliveryMethodDto) {
    return this.deliveryMethodsService.create(body);
  }

  @Get()
  getAllDeliveryMethods() {
    return this.deliveryMethodsService.getAll();
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  updateDeliveryMethod(
    @Param('id') id: string,
    @Body() body: Partial<CreateDeliveryMethodDto>,
  ) {
    return this.deliveryMethodsService.update(parseInt(id), body);
  }

  @Get(':id')
  getDeliveryMethod(@Param('id') id: string) {
    return this.deliveryMethodsService.get(parseInt(id));
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteDeliveryMethod(@Param('id') id: string) {
    return this.deliveryMethodsService.remove(parseInt(id));
  }
}
