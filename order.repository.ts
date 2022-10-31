import { Order } from './order.entity';
import { Repository, EntityRepository, getRepository, Connection, ConnectionManager, IsNull, Not, EntityManager } from 'typeorm';
import { _handleFromToDate } from 'src/util-common/date.utils';

/**
 * this is class repository use to working with database
 */
@EntityRepository(Order)
export class OrderRepository extends Repository<Order>{
    private logger = new Logger('OrderRepository');


    /**
     * 
     * @param order_id 
     * @returns object order 
     */
    async getOrderIdTmm(order_id: number) {
        try {
            const query = this.createQueryBuilder('retail_order');
            query.select([
                'retail_order.id', 'retail_order.order_id_tmm'
            ]);
            query.where('retail_order.id = :id', { id: order_id })
                .andWhere('retail_order.is_deleted = :is_deleted', { is_deleted: false })
            const orders = await query.getOne();
            return orders;
        } catch (error) {
            this.logger.error(`Error occurred when get orders, please try again later.`, error.stack);
            return ({ code: 201, data: "Error occurred when get orders. Please try again later." });
        }
    }


}


