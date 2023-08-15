
enum OccurenceTypeEnum {
    'consumer_ad_hoc',
    'merchant_ad_hoc',
    'merchant_recurring',
}

enum ChargeFailureCodeEnum {
    "insufficient_funds",
    "avs_check_failed",
    "generic_decline",
    "call_issuer",
    "expired_card",
    "pickup_card",
    "invalid_number",
    "limit_exceeded",
    "not_permitted",
    "incorrect_cvc",
    "service_not_allowed",
    "invalid_expiry",
    "card_not_supported",
    "restricted_card",
    "fraudulent",
    "processing_error",
    "bank_account_blocked",
    "internal_error"
}

interface ICharge {
    amount_captured: number;
    amount_refunded: number;
    captured: boolean;
    created_at: string;
    id: string;
    payment_intent_id: string;
    payment_method_id: string;
    refunded: boolean;
    refunds: Array<IRefund>;
    status: string;
    updated_at: string;
    balance_transaction?: IBalanceTransaction;
    captured_at?: string;
    failure_code?: ChargeFailureCodeEnum;
    failure_message?: string;
    platform_fee?: IPlatformFee;
}