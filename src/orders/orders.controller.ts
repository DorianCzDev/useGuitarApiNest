import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.ordersService.create(createOrderDto, req);
  }

  @Get()
  @UseGuards(AdminGuard)
  getAllOrders() {
    return this.ordersService.getAll();
  }

  @Get('user')
  @UseGuards(AuthGuard)
  getUserOrders(@Req() req: Request) {
    return this.ordersService.getByUser(req);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getOrder(@Param('id') id: string, @Req() req: Request) {
    return this.ordersService.get(parseInt(id), req);
  }
}
