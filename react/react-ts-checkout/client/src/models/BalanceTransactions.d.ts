enum BalanceTransactionSourceTypeEnum {
    'charge',
    'refund',
    'payout',
    'payment_method',
    'platform_fee',
    'platform_fee_refund',
    'dispute',
    'account',
}

// enum BalanceTransactionStatusEnum {
//     'available',
//     'pending',
// }

// enum BalanceTransactionType {
//     'charge',
//     'charge_failure_refund',
//     'dispute',
//     'dispute_won',
//     'refund',
//     'refund_failure',
//     'adjustment',
//     'commission',
//     'payout',
//     'payout_cancel',
//     'payout_failure',
//     'fee',
//     'platform_fee',
//     'platform_fee_refund',
//     'charge_fee',
//     'refund_fee',
//     'account_fee',
//     'payment_method_fee',
//     'tilled_fee',
// }

enum BalanceTransactionSubTypeEnum {
    'approved_verification',
    'declined_verification',
    'approved_authorization',
    'declined_authorization',
    'reversed_authorization',
    'completed_credit',
    'declined_credit',
    'completed_settlement',
    'declined_settlement',
    'approved_purchase_return_authorization',
    'declined_purchase_return_authorization',
    'acquirer_processing',
    'amex_card_not_present',
    'amex_dues_and_assessments',
    'amex_international_assessment',
    'discover_assessment',
    'discover_data_usage',
    'dues_and_assessments',
    'fixed_acquirer_network',
    'mastercard_annual_location',
    'mastercard_assessment',
    'mastercard_assessment_1000_plus',
    'mastercard_digital_commerce_development',
    'mastercard_digital_enablement',
    'mastercard_international_assessment',
    'mastercard_processing_integrity',
    'nabu',
    'transaction_integrity',
    'visa_assessment',
    'visa_debit_assessment',
    'visa_international_assessment',
    'visa_misuse_of_authorization',
    'reversal',
    'discount',
    'transaction',
    'account_setup',
    'ach_return',
    'monthly_account',
    'monthly_minimum_processing',
    'retrieval',
    'goods_and_services',
    'harmonized_sales',
}

enum BalanceTransactionFeeTypeEnum {
    'discount',
    'transaction',
    'interchange',
    'pass_through',
    'platform',
    'chargeback',
    'administrative',
    'tax',
    'rounding_adjustment',
    'unknown',
}

interface IBalanceTransaction {
    account_id: string;
    amount: number;
    available_on: string;
    created_at: string;
    currency: string;
    fee?: number; // deprecated
    fee_details?: any | undefined; // deprecated
    id: string;
    net?: number | undefined; // deprecated
    source_id: string;
    source_type: BalanceTransactionSourceTypeEnum;
    // status: BalanceTransactionStatusEnum;
    status: string;
    // type: BalanceTransactionType;
    type: string;
    updated_at: string;
    description?: string | undefined;
    fee_subtype?: BalanceTransactionSubTypeEnum;
    fee_type?: BalanceTransactionFeeTypeEnum;
    payout_id?: string;
}

export interface IBalanceTransactionsList {
    has_more: boolean;
    items: Array<BalanceTransaction>;
    limit?: number;
    offset?: number;
    total?: number;
}