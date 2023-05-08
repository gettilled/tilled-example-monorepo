interface IPlatformFeeRefund {
    amount: number;
    balance_transaction: IBalanceTransaction;
    created_at: string;
    id: string;
    platform_fee_id: string;
    updated_at: string;
}

interface IPlatformFee {
    amount: number;
    amount_refunded: number;
    balance_transaction: IBalanceTransaction;
    charge_id: string;
    created_at: string;
    currency: CurrencyEnum;
    id: string;
    payee_account_id: string;
    payer_account_id: string;
    refunded: boolean;
    refunds: IPlatformFeeRefund;
    updated_at: string;
}