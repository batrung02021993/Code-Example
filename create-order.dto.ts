import { IsNotEmpty, IsNumber, IsOptional, ValidateIf } from 'class-validator';


export class CreateOrderDto {

    @IsNotEmpty()
    subtotal: number;

    @IsNotEmpty()
    shipping_fee: number;

    advisor_customer_id: number;

    buy_for_customer_id?: number;

    @IsNotEmpty()
    @IsNumber()
    delivery_address_id: number;

    @IsNotEmpty()
    @IsNumber()
    customer_information_id: number;

    @IsNotEmpty()
    @IsNumber()
    shipping_id: number;

    @IsNumber()
    total_amount: number;

    advisor_create?: boolean;

    @IsOptional()
    @IsNumber()
    @ValidateIf((object, value) => value !== null)
    sale_type_id?: number | null;

    warranty_request_id: number;

    create_session? : boolean;

    is_reactivate?: boolean;

    is_merchandise? : boolean;

    is_vip? : boolean;

}