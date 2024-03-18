import { Injectable } from '@angular/core';
import { TilledFieldsService } from 'app/core/services/tilled-fields.service';
import { CheckoutComponent } from 'app/modules/checkout/checkout.component';
declare let Tilled: any;

interface TilledInstance {
  form: (config: any) => Promise<any>;
  createPaymentMethod: (config: any) => Promise<any>;
  confirmPayment: (config: any, paymentMethod: any) => Promise<any>;
}

@Injectable({
  providedIn: 'root',
})

export class TilledService {
  private tilledCard: TilledInstance | null = null;
  private tilledAchDebit: TilledInstance | null = null;
  private readonly fieldOptions = this.tilledFields.FieldOptions;

  constructor(private tilledFields: TilledFieldsService) {}

  async createPaymentMethod(isCard: boolean, formDetails: any): Promise<any> {
    const tilledInstance = isCard ? this.tilledCard : this.tilledAchDebit;

    if (!tilledInstance) {
      throw new Error('Tilled form is not initialized');
    }

    let paymentMethodConfig;
    if (isCard) {
      paymentMethodConfig = {
        type: 'card',
        billing_details: formDetails,
      };
    } else {
      paymentMethodConfig = {
        type: 'ach_debit',
        ach_debit: formDetails.ach_debit,
        billing_details: formDetails.billing_details,
      };
    }

    return tilledInstance.createPaymentMethod(paymentMethodConfig);
  }

  async confirmPayment(
    clientSecret: string,
    isCard: boolean,
    formDetails: any
  ): Promise<any> {
    const tilledInstance = isCard ? this.tilledCard : this.tilledAchDebit;

    if (!tilledInstance) {
      throw new Error('Tilled form is not initialized');
    }

    let paymentMethodConfig;
    if (isCard) {
      paymentMethodConfig = {
        payment_method: {
          type: 'card',
          billing_details: formDetails,
        },
      };
    } else {
      paymentMethodConfig = {
        payment_method: {
          type: 'ach_debit',
          ach_debit: formDetails.ach_debit,
          billing_details: formDetails.billing_details,
        },
      };
    }

    return tilledInstance.confirmPayment(clientSecret, paymentMethodConfig);
  }

  // Below we load the Tilled.js script, initialize the form, and set up the fields

  async loadTilledScript(): Promise<void> {
    if (typeof Tilled !== 'undefined') {
      return;
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.tilled.com/v2';
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('Tilled.js script failed to load'));
      document.head.appendChild(script);
    });
  }

  async initializeForm(
    publishableKey: string,
    merchantAccountId: string,
    isCard: boolean
  ): Promise<any> {
    const tilled = new Tilled(publishableKey, merchantAccountId, {
      sandbox: true,
      log_level: 0,
    });

    const formType = isCard ? 'card' : 'ach_debit';
    const form = await tilled.form({ payment_method_type: formType });

    const fields = isCard
      ? ['cardNumber', 'cardExpiry', 'cardCvv']
      : ['bankAccountNumber', 'bankRoutingNumber'];
    this.setupFormFields(form, fields);

    await form.build();
    if (isCard) {
      this.tilledCard = tilled;
    } else {
      this.tilledAchDebit = tilled;
    }

    return form;
  }

  private setupFormFields(form: any, fields: string[]): void {
    fields.forEach((field) => {
      form
        .createField(field, {
          ...this.fieldOptions,
          placeholder: this.tilledFields.getPlaceholderForField(field),
        })
        .inject(`#${this.tilledFields.getElementIdsForField(field)[0]}`);
      this.tilledFields.setupFieldEventListeners(form.fields[field], field);
    });
  }
}
