import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateOrderDto } from './dto/update-order.dto';

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
  getAllOrders(
    @Query('page') page: string,
    @Query('id') id: string,
    @Query('last_name') lastName: string,
    @Query('email') email: string,
  ) {
    return this.ordersService.getAll(
      parseInt(page),
      parseInt(id),
      lastName,
      email,
    );
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

  @Patch(':id')
  @UseGuards(AdminGuard)
  updateOrder(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    return this.ordersService.update(parseInt(id), body);
  }

  // @Get('stats')
  // @UseGuards(AdminGuard)
  // getOrdersStatistics() {
  //   return this.ordersService.getStats();
  // }
}
