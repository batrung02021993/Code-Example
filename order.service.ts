import { Injectable, Logger, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Customer } from 'src/auth/customer.entity';
import { Order } from './order.entity';
import { CartService } from 'src/cart/cart.service';
import { OrderLineItemService } from '../order-line-item/order-line-item.service';
import { AddressService } from '../address/address.service';
import { CustomerInformationService } from '../customer-information/customer-information.service';
import { AuthService } from 'src/auth/auth.service';
import { ShippingService } from 'src/shipping/shipping.service';
import { OrderHistoryService } from 'src/order-history/order-history.service';
import { ResponseOrder, ResponseCodeOrder, ResponseOrderWithParam } from 'src/util-common/response/responseOrder';
import { v4 as uuid } from 'uuid';
import { CheckNullOrUndefinedOrEmpty } from 'src/util-common/common-function';
import { CustomerRemoveContactRepository } from 'src/customer-remove-contact/customer_remove_contact.repository';
import { ECOUNTSTATUS } from 'src/util-common/ecount_status.enum';



@Injectable()
export class OrderService {
    private logger = new Logger('OrderService');
    constructor(
        @InjectRepository(OrderRepository)
        private orderRepository: OrderRepository,
        @Inject(forwardRef(() => CartService))
        private cartService: CartService,
        private orderLineItemService: OrderLineItemService,
        @Inject(forwardRef(() => AddressService))
        private addressService: AddressService,
        @Inject(forwardRef(() => CustomerInformationService))
        private customerInformationService: CustomerInformationService,
        private authService: AuthService,
        @Inject(forwardRef(() => ShippingService))
        private shippingService: ShippingService,
        @Inject(forwardRef(() => OrderHistoryService))
        private orderHistoryService: OrderHistoryService,
        @InjectRepository(CustomerRemoveContactRepository)
        private customerRemoveContactRepository: CustomerRemoveContactRepository,
    ) { }

    /**
     * This is func service create new order
     * @param createOrderDto 
     * @param customer 
     * @returns code : 20, message : create order successfull, data : order_id
     */
    async createOrder(createOrderDto: CreateOrderDto, customer: Customer) {
        let order_tmm: number;
        let resultCreateOrder = null;

        // Get info advisor
        const advisor = await this.authService.getAdvisorByNumberId(customer.entity_id, createOrderDto.advisor_customer_id);
        // Get info shipping
        const shipping = await this.shippingService.findShippingById(createOrderDto.shipping_id);
        // Check if shipping is null return else continue create order
        if (shipping !== null) {
            const newOrder = new Order();
            newOrder.uuid = uuid();
            newOrder.customer_id = customer.id;
            newOrder.is_deleted = false;
            newOrder.subtotal = createOrderDto.subtotal;
            newOrder.shipping_fee = createOrderDto.shipping_fee;
            newOrder.tax = 0;
            newOrder.created_at = new Date();
            newOrder.updated_at = new Date();
            newOrder.advisor_customer_id = !CheckNullOrUndefinedOrEmpty(advisor) ? advisor.id : null;
            newOrder.delivery_address = await this.addressService.findAddressById(createOrderDto.delivery_address_id);
            newOrder.customer_information = await this.customerInformationService.getCustomerInformationById(createOrderDto.customer_information_id);
            newOrder.shipping = shipping;
            newOrder.entity_id = customer.entity_id;
            newOrder.buy_for_customer_id = createOrderDto.buy_for_customer_id;
            newOrder.total_amount = createOrderDto.total_amount;
            newOrder.ecount_status = ECOUNTSTATUS.SEND;

            try {

                const customer_id = newOrder.customer_id;

                // Get info cart by customer id && entity_id
                let getCartInfo = await this.cartService.findCartByCustomerId(customer.entity_id, customer_id)

                const listCartItem = !CheckNullOrUndefinedOrEmpty(getCartInfo) ? getCartInfo.cart_items : null;

                // Check status order
                newOrder.need_unbox = false;
                newOrder.need_host = false;
                listCartItem.forEach(async item => {
                    newOrder.need_unbox = (newOrder.need_unbox || item.product.need_unbox);
                    newOrder.need_host = (newOrder.need_host || item.product.need_host);
                });
                resultCreateOrder = await newOrder.save();

                // Create order
                if (resultCreateOrder) {
                    const result = await this.orderRepository.getOrderIdTmm(newOrder.id);
                    newOrder.order_id_tmm = result['order_id_tmm'];
                    order_tmm = result['order_id_tmm'];
                    if (!CheckNullOrUndefinedOrEmpty(advisor)) {
                        this.customerRemoveContactRepository.removeRemoveContact(newOrder.customer_id, advisor.id)
                    }
                }

                // func create order history
                await this.orderHistoryService.createOrderHistory(newOrder.id, `Order ${newOrder.order_id_tmm} has been created.`, customer.id, null);

                // func create order line redemtion
                listCartItem.forEach(async item => {
                    await this.orderLineItemService.createOrderLineRedemtion(customer, newOrder, item);
                });
                // Get info cart by customer_id && entity_id
                const cart = await this.cartService.findCartByCustomerId(customer.entity_id, customer_id);
                // func delete cart
                await this.cartService.deleteCart(customer.entity_id, cart.id);
            } catch (error) {
                if (error) {
                    return (ResponseOrder(ResponseCodeOrder.ORDER_R001));
                }
            }
        } else {
            return (ResponseOrder(ResponseCodeOrder.ORDER_R002));
        }
        return ({ code: 200, message: ResponseCodeOrder.ORDER_R003, data: { id: resultCreateOrder.id, uuid: resultCreateOrder.uuid, order_tmm: order_tmm } });
    }


}
