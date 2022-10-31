import { CreateOrderAdminDto, OrderIdDto } from './dto/admin-create-order.dto';
import { Controller, UseGuards, Post, ValidationPipe, UsePipes, Body Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { Customer } from 'src/auth/customer.entity';

/**
 * this is controller process order
 */
@Controller('orders')
export class OrderController {
    private logger = new Logger('OrderController');
    constructor(
        private orderService: OrderService,
    ) { }

    /**
     * 
     * @param createOrderDto 
     * @param customer 
     * @returns code : 200, message : create order successfull, data : order_id
     */
    @Post('/create')
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    createOrder(
        @Body(ValidationPipe) createOrderDto: CreateOrderDto,
        @GetUser() customer: Customer
    ) {
        return this.orderService.createOrder(createOrderDto, customer);
    }


}
