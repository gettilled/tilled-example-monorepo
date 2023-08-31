import { PaymentMethodsApi, PaymentMethodAttachParams, PaymentMethod } from 'tilled-node';
import { getConfig } from './config';

export async function attachPaymentMethod(tilledAccount: string, paymentMethodId: string, options: PaymentMethodAttachParams) {
    const config = getConfig();
    const paymentMethodsApi = new PaymentMethodsApi(config);
    const duplicateCardMsg = 'The card associated with this PaymentMethod is already associated with this customer on another PaymentMethod.';
    try {
        const response = await paymentMethodsApi.attachPaymentMethodToCustomer({ tilled_account: tilledAccount, id: paymentMethodId, PaymentMethodAttachParams: options });
        console.log(response.data);
        return response.data;
    } catch (error) {
        if (error.response.data.message === duplicateCardMsg) {
            const { customer_id } = options;
            try {
                // trying to get the payment method that is already attached to the customer
                const pm = await paymentMethodsApi.getPaymentMethod({ tilled_account: tilledAccount, id: paymentMethodId });
                const { type, card } = pm.data;

                const pmListResponse = await paymentMethodsApi.listPaymentMethods({ tilled_account: tilledAccount, customer_id, type });
                const pmList = pmListResponse.data.items;

                let returnedPM: PaymentMethod | undefined;

                // This is imperfect, but having multiple cards with the same last 4 digits, 
                // card.brand, card.exp_year, card.exp_month, and card.funding is unlikely
                for (const pm of pmList) {
                    if ((card && card.last4 === card.last4) || (card && card.brand === card.brand) || (card && card.exp_year === card.exp_year) || (card && card.exp_month === card.exp_month) || (card && card.funding === card.funding)) {
                        returnedPM = pm;
                        break;
                    }
                }

                if (returnedPM) {
                    return returnedPM;
                } else {
                    throw new Error("Unable to find duplicate payment method.");
                }
            } catch (error) {
                throw new Error(error);
            }
        } else {
            throw new Error(error);
        }
    }
}