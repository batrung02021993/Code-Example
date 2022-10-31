
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { OrderStatus } from '../util-common/order.status.enum';
import { Payment } from "src/payment/payment.entity";
import { OrderLineItem } from '../order-line-item/order-line-item.entity';
import { Address } from "src/address/address.entity";
import { CustomerInfomation } from "src/customer-information/customer-information.entity";
import { Customer } from "src/auth/customer.entity";
import { Shipping } from "src/shipping/shipping.entity";
import { OrderHistory } from "src/order-history/order-history.entity";
import { PaymentInstallment } from '../payment/core/payment-installment.entity';

import { OrderPaymentOption } from "src/payment/enum/payment-option.enum";
import { OrderLocked } from "src/order-locked/order-locked.entity";
import { WarrantyProductEntity } from "src/warrantied-products/warrantied-products.entity";
import { HostGiftAdvisorEntity } from "src/host-gift-advisor/host-gift-advisor.entity";
import { RecruitmentSalesHistoryEntity } from "src/recruitment-sales-history/recruitment-sales-history.entity";
import { JustHostEventEntity } from "src/just-host-event/just-host-event.entity";
import { ReferralGiftEntity } from "src/referral-gift/referral_gift.entity";
import { SalesMonitorEntity } from "src/sales-monitor/sales-monitor.entity";
import { SaleType } from "src/sale-type/sale-type.entity";
import { WarrantyRequest } from "src/warranty-request/warranty-request.entity";
import { PackageOrderEntity } from "src/package-order/package-order.entity";
import { AwardIncentivesProcessEntity } from "src/advisory-incentives/award-incentives-process/award-incentives-process.entity";
import { QrMonitorEntity } from "src/qr-monitor/qr-monitor.entity";
import { VipProductEntity } from "src/vip-product/vip-product.entity";
import { VipCustomerMerchandiseEntity } from "src/vip-customer-merchandise/vip-customer-merchandise.entity";


@Entity({ schema: 'retail_order' })
export class Order extends BaseEntity {

    @PrimaryGeneratedColumn({ type: 'int8' })
    id: number;

    @Column({ type: 'int8' })
    order_id_tmm: number;

    @Column({ type: 'varchar' })
    uuid : string;

    @Column({ type: 'int8' })
    customer_id: number;

    @Column()
    is_deleted: boolean;

    @Column()
    subtotal: number;

    @Column()
    shipping_fee: number;

    @Column()
    tax: number;
    
    @Column({ type: 'int8' })
    advisor_customer_id: number;

    @Column({ type: 'int8' })
    buy_for_customer_id: number;

    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({type: 'int8'})
    sale_type_id: number;

    @Column({type: 'int8'})
    delivery_address_id: number;

    @Column({type: 'int8'})
    customer_information_id: number;

    @ManyToOne(type => Customer, customer => customer.orders, { eager: false })
    @JoinColumn({ name: 'advisor_customer_id', referencedColumnName: 'id' })
    advisor_customer: Customer;

    @OneToOne(type => Address, { eager: true })
    @JoinColumn({ name: 'delivery_address_id', referencedColumnName: 'id' })
    delivery_address: Address;

    @OneToOne(type => CustomerInfomation, { eager: true })
    @JoinColumn({ name: 'customer_information_id', referencedColumnName: 'id' })
    customer_information: CustomerInfomation;

    @Column({ type: 'int8' })
    entity_id: number;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.TO_PAY })
    status: OrderStatus;

    @Column()
    shipping_id: number;

    @Column()
    total_amount: number;

    @OneToMany(type => OrderLineItem, order_items => order_items.order, { eager: true })
    order_items: OrderLineItem[];

    @OneToMany(type => Payment, payments => payments.order, { eager: false })
    payments: Payment[];


    @ManyToOne(type => Customer, customer => customer.orders, { eager: false })
    @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
    customer: Customer;

    @OneToOne(type => Shipping, { eager: true })
    @JoinColumn({ name: 'shipping_id', referencedColumnName: 'id' })
    shipping: Shipping;

    @OneToMany(type => OrderHistory, history => history.order)
    // @JoinColumn({name: 'id', referencedColumnName: 'order_id'})
    histories: OrderHistory[];

    @Column({ type: 'varchar' })
    no_unboxed_reasons: string;

    @Column({ type: 'varchar' })
    no_hosted_reasons: string;

    @Column()
    need_unbox : boolean;

    @Column()
    need_host : boolean;

    @Column({type: 'varchar', length: 200})
    remark_advisor_name: string;

    @Column({type: 'varchar', length: 20})
    remark_advisor_id: string;

    @Column({type: 'varchar', length: 20})
    remark_phone_number: string;

    @Column()
    is_buying_for_customer : boolean;

    @Column()
    is_customer_pay : boolean;

    @Column()
    expire_session : boolean;

    @Column()
    session : string;

    @Column()
    key_invoice: string

    @Column()
    made_full_payment_at: Date; // Record Time Order change status become TO_VERIFY
    //
    // @OneToOne(type => PaymentInstallment, payment_installment => payment_installment.order, { eager: true })
    // payment_installment: PaymentInstallment;


    @Column({ type: 'timestamp without time zone' })
    payment_verified_at: Date; // Record Time Order change status become TO_SHIP

    @Column({ type: 'enum', enum: OrderPaymentOption })
    payment_option: string;

    @Column()
    is_assign_advisor: boolean;

    @Column()
    package_order_id: number;
    
    //shipment group
    @Column({ type: 'int8' })
    suggested_shipment_group: number;

    @Column({ type: 'boolean', default: false })
    flag: boolean;

    @Column()
    number_shipped : number;

    @OneToOne(type => PaymentInstallment, paymentInstallment => paymentInstallment.order, { eager: false })
    @JoinColumn({ name: 'id', referencedColumnName: 'order_id' })
    paymentInstallment: PaymentInstallment;

    @OneToOne(type => OrderLocked)
    @JoinColumn({ name: 'id', referencedColumnName: 'order_id' })
    orderLocked: OrderLocked;

    @OneToMany(type => WarrantyProductEntity , warranty => warranty.orderWarranty)
    warrantyProduct: WarrantyProductEntity;

    @OneToOne(type => HostGiftAdvisorEntity, host_gift=> host_gift.order )
    host_gift: HostGiftAdvisorEntity;

    @OneToOne(type => HostGiftAdvisorEntity, host_gift=> host_gift.order_redeem )
    redeem: HostGiftAdvisorEntity;

    // @OneToOne(type => JustHostEventEntity, host_gift=> host_gift.order_redeem )
    // just_host: JustHostEventEntity;

    @Column()
    shipped_at: Date;

    @Column()
    complete_delivery_date: Date; // Record Time Order change status become TO_RECEIVED

    @Column()
    completed_at: Date;

    @Column()
    warranty_request_id: number;

    @Column()
    target_date: Date;

    @OneToOne(type => RecruitmentSalesHistoryEntity, rs=>rs.order)
    @JoinColumn({ name: 'id', referencedColumnName: 'order_id' })
    recruitmentSalesHistory: RecruitmentSalesHistoryEntity;

    @OneToOne(type => ReferralGiftEntity, referral_gift=> referral_gift.order )
    referral_gift: ReferralGiftEntity;

    @OneToOne(type => ReferralGiftEntity, referral_gift=> referral_gift.order_redeem )
    referral_gift_redeem: ReferralGiftEntity;

    @OneToOne(() => SalesMonitorEntity, sale=> sale.order )
    saleMonitor: SalesMonitorEntity;

    @OneToOne(() => QrMonitorEntity, qr=> qr.orderFirstSale )
    qrMonitor: SalesMonitorEntity;

    @OneToOne(() => Customer)
    @JoinColumn({ name: 'buy_for_customer_id', referencedColumnName: 'id' })
    buy_for_customer: Customer;

    @Column()
    cancelled_confirmation : boolean;

    @Column({ type: 'boolean' })
    is_reactivate: boolean;

    @Column({ type: 'boolean' })
    is_merchandise: boolean;

    @Column({ type: 'boolean' })
    is_vip: boolean;

    @ManyToOne(type => SaleType, saleType => saleType.order, {eager: true})
    @JoinColumn({ name: 'sale_type_id', referencedColumnName: 'id' })
    saleType: SaleType;

    @OneToOne(type=> WarrantyRequest , warranty_request=> warranty_request.order)
    @JoinColumn({ name: 'warranty_request_id', referencedColumnName: 'id' })
    warranty_request: WarrantyRequest;

    @OneToOne(type=> WarrantyRequest , warranty_request_repair=> warranty_request_repair.order_repair)
    warranty_request_repair: WarrantyRequest;

    @ManyToOne(type=>PackageOrderEntity, package_order=>package_order.order, {eager: true, cascade: ['update']})
    @JoinColumn({ name: 'package_order_id', referencedColumnName: 'id'})
    package_order: PackageOrderEntity;

    @OneToOne(type => AwardIncentivesProcessEntity, awardIncentivesProcess=> awardIncentivesProcess.order )
    awardIncentivesProcess: AwardIncentivesProcessEntity;

    @Column({type : 'int8'})
    manual_order_tmm_id : number

    @OneToOne(type => VipProductEntity, vip_product=> vip_product.order )
    vip_product: VipProductEntity;

    @OneToOne(type => VipCustomerMerchandiseEntity, merchandise=> merchandise.order )
    merchandise: VipCustomerMerchandiseEntity;

    @Column({type: 'varchar', length: 20})
    ecount_status: string;
}

