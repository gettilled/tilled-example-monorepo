enum AchDebitAccountTypeEnum {
    "checking",
    "savings",
    "unknown"
}

enum CardBrandEnum {
    "amex",
    "diners",
    "discover",
    "jcb",
    "maestro",
    "mastercard",
    "solo",
    "visa",
    "visa_debit",
    "visa_electron",
    "unknown"
}

enum CardCheckEnum {
    "pass",
    "fail",
    "unavailable",
    "unchecked",
}

enum FundingEnum {
    "credit",
    "debit",
    "prepaid",
    "unknown"
}

enum CurrencyEnum {
    'aud',
    'cad',
    'dkk',
    'eur',
    'hkd',
    'jpy',
    'nzd',
    'nok',
    'gbp',
    'zar',
    'sek',
    'chf',
    'usd',
}

enum PaymentMethodTypesEnum {
    'card',
    'ach_debit',
    'eft_debit',
}

interface IAchDebit {
    account_type?: AchDebitAccountTypeEnum;
    bank_name?: string;
    last2?: string;
    routing_number?: string;
}

interface IEftDebit {
    bank_name?: string;
    institution_id?: string;
    last2?: string;
    transit_number?: string;
}

interface ICardChecks {
    // address_line1_check?: CardCheckEnum;
    address_line1_check?: string;
    // address_postal_code_check?: CardCheckEnum;
    address_postal_code_check?: string;
    // cvc_check?: CardCheckEnum;
    cvc_check?: string;
}

interface ICard {
    // brand?: CardBrandEnum;
    brand?: string;
    checks?: ICardChecks;
    exp_month?: number;
    exp_year?: number;
    // funding?: FundingEnum;
    funding?: string;
    holder_name?: string;
    last4?: string;
}

interface IAddress {
    city?: string;
    country?: string;
    state?: string;
    street?: string;
    street2?: string;
    zip?: string;
}

interface BillingDetails {
    address?: IAddress;
    email?: string;
    name?: string;
    phone?: string;
}

export interface IPaymentMethodParams {
    type: string;
    billing_details?: IBillingDetails;
    ach_debit?: { account_type: string, account_holder_name: string };
}

export interface IPaymentMethodResponse {
    chargeable: boolean;
    created_at: string;
    id: string;
    // type: PaymentMethodTypesEnum;
    type: string;
    updated_at: string;
    ach_debit?: IAchDebit;
    billing_details?: IBillingDetails;
    card?: ICard;
    customer_id?: string;
    eft_debit?: IEftDebit;
    expires_at?: string;
    metadata?: any;
    nick_name?: string;
}