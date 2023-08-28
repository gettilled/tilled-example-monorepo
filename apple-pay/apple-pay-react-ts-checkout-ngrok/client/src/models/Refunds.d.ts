enum RefundStatusEnum {
    "canceled",
    "pending",
    "succeeded",
    "failed"
}

enum RefundFailureCodeEnum {
    "expired_or_canceled_card",
    "lost_or_stolen_card",
    "fraudulent",
    "declined",
    "proprietary_card_activity_regulations",
    "blacklisted_card",
    "not_permitted",
    "processing_error"
}

enum RefundReasonEnum {
    "duplicate",
    "fraudulent",
    "requested_by_customer",
    "expired_uncaptured_charge",
    "partial_capture"
}

enum CancellationReasonEnum {
    'duplicate',
    'fraudulent',
    'requested_by_customer',
    'abandoned',
    'automatic',
}

interface IRefund {
    amount: number;
    balance_transaction: IBalanceTransaction;
    charge_id: string;
    created_at: string;
    id: string;
    payment_intent_id: string;
    status: RefundStatusEnum;
    updated_at: string;
    failure_code?: RefundFailureCodeEnum;
    failure_message?: string;
    metadata?: any;
    payment_method_id?: string;
    reason?: RefundReasonEnum;
}