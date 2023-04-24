export type Subscription = {
    billing_cycle_anchor: Date | string;
    currency: string;
    interval_unit: string;
    price: number;
};