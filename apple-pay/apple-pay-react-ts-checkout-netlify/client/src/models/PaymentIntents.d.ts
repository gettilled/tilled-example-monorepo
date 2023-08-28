import { IBalanceTransaction } from 'models/BalanceTransactions.d.ts';

enum PaymentIntentStatusEnum {
    'canceled',
    'processing',
    'requires_action',
    'requires_capture',
    'requires_confirmation',
    'requires_payment_method',
    'succeeded',
}

interface ILineItems {
    product_code: string;
    product_description: string;
    quantity: number;
    tax_amount: number;
    unit_amount: number;
}

interface ILevel3 {
    duty_amount: number;
    line_items: ILineItems;
    shipping_address_country: string;
    shipping_address_zip: string;
    shipping_amount: number;
    shipping_from_zip: string;
}

interface ILastPaymentError {
    charge_id: string;
    message: string;
    code?: ChargeFailureCodeEnum;

}

export interface IPaymentIntent {
    account_id: string;
    amount: number;
    amount_capturable: number;
    amount_receivable: number;
    capture_method: string;
    charges: Array<ICharge>;
    client_secret: string;
    created_at: string;
    // currency: CurrencyEnum;
    currency: string;
    id: string;
    payment_method_types: Array<PaymentMethodTypesEnum>;
    // payment_method_types: Array<string>;
    // status: PaymentIntentStatusEnum;
    status: string;
    updated_at: string;
    canceled_at?: string;
    cancellation_reason?: CancellationReasonEnum;
    // cancellation_reason?: string;
    customer?: ICustomer;
    last_payment_error?: ILastPaymentError;
    level3?: ILevel3;
    metadata?: any;
    occurence_type?: OccurenceTypeEnum;
    payment_method?: IPaymentMethod;
    platform_fee_amount?: number;
    statement_descriptor_suffix?: string;
    subscription_id?: string;
}

interface IPaymentsList {
    has_more: boolean;
    items: Array<IPaymentIntent>;
    limit?: number;
    offset?: number;
    total?: number;
}