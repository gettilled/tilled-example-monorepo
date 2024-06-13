import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material/slide-toggle';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { TilledService } from '../../core/services/tilled.service';
import { ProductsList } from '../../utils/products-list';
import { SelectionTypes } from '../../utils/selection-types';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { NgFor, NgIf, DecimalPipe, KeyValuePipe, NgClass } from '@angular/common';
import { TilledFieldsService } from 'app/core/services/tilled-fields.service';
import { ReceiptComponent, ReceiptData } from '../receipt/receipt.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgClass,
    MatButtonToggleGroup,
    MatButtonToggle,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatIcon,
    MatSlideToggle,
    MatButton,
    DecimalPipe,
    KeyValuePipe,
    MatError,
    MatTooltipModule,
    ReceiptComponent,
  ],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private publishableKey = environment.publishableKey;
  private merchantAccountId = environment.merchantAccountId;

  public cardPaymentForm: FormGroup;
  public achDebitPaymentForm: FormGroup;
  public tilledCardForm: any;
  public tilledAchDebitForm: any;
  public paymentMethodType = 'card';
  public savePaymentMethod: boolean = false;
  public stateCodeMap: Map<string, string>;
  public countryCodeMap: Map<string, string>;
  public accountTypeMap: Map<string, string>;
  public products = ProductsList.products;
  public taxRate = ProductsList.taxRate;
  public merchantName = environment.merchantName;
  public subtotal: number;
  public tax: number;
  public total: number;
  public showCardNumberError = false;
  public showExpirationError = false;
  public showCvvError = false;
  public showAccountNumberError = false;
  public showRoutingNumberError = false;
  public showReceipt = false;
  public receiptDetails: ReceiptData;
  public paymentMethodDetails: string = '****';

  private fieldChangeSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private tilledService: TilledService,
    private tilledFieldService: TilledFieldsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.tilledService.loadTilledScript().then(() => {
      this.setupPaymentForm(this.paymentMethodType);
    });
    this.calculateTotal();
    // Subscribe to the field change event from the TilledFieldsService
    this.fieldChangeSubscription = this.tilledFieldService.fieldChange$.subscribe((data) => {
      this.showTilledFieldError(data);
    });
  }

  ngOnDestroy(): void {
    this.teardownForm();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.fieldChangeSubscription.unsubscribe();
  }

  private initializeForms(): void {
    this.cardPaymentForm = this.formBuilder.group({
      cardholderName: new FormControl<string | null>(null, Validators.required),
      country: new FormControl<string | null>(null, Validators.required),
      postalCode: new FormControl<string | null>(null, Validators.required),
    });

    this.achDebitPaymentForm = this.formBuilder.group({
      accountholderName: new FormControl<string | null>(null, Validators.required),
      accountType: new FormControl<string | null>(null, Validators.required),
      street1: new FormControl<string | null>(null, Validators.required),
      street2: new FormControl<string | null>(null),
      country: new FormControl<string | null>(null, Validators.required),
      state: new FormControl<string | null>(null, Validators.required),
      city: new FormControl<string | null>(null, Validators.required),
      postalCode: new FormControl<string | null>(null, Validators.required),
    });
    this.stateCodeMap = SelectionTypes.statesMap;
    this.countryCodeMap = SelectionTypes.countriesMap;
    this.accountTypeMap = SelectionTypes.accountTypesMap;
  }

  // Initialize the Tilled payment form
  async setupPaymentForm(paymentMethodType: string): Promise<void> {
    this.teardownForm();
    this.paymentMethodType = paymentMethodType;

    if (paymentMethodType === 'card') {
      this.tilledCardForm = await this.tilledService.initializeForm(this.publishableKey, this.merchantAccountId, true);
    } else if (paymentMethodType === 'ach_debit') {
      this.tilledAchDebitForm = await this.tilledService.initializeForm(this.publishableKey, this.merchantAccountId, false);
    }
  }

  // Update the total price based on the cart service
  private calculateTotal(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.tax = this.cartService.getTax(this.subtotal);
    this.total = this.cartService.getTotal(this.subtotal, this.tax);
  }

  async onSubmit(): Promise<void> {
    if (this.savePaymentMethod) {
      await this.createAndSavePaymentMethod();
    } else {
      await this.confirmPayment();
    }
  }

  async createAndSavePaymentMethod(): Promise<void> {
    if (this.paymentMethodType === 'card' && this.cardPaymentForm.valid) {
      try {
        const cardDetails = this.getCardDetails();
        const paymentMethod = await this.tilledService.createPaymentMethod(true, cardDetails);
        console.log('Payment method created:', paymentMethod);
        await this.createCustomerAndAttachPM(paymentMethod.id);
      } catch (error) {
        console.error('Error in payment process:', error);
      }
    } else if (this.paymentMethodType === 'ach_debit' && this.achDebitPaymentForm.valid) {
      try {
        const bankDetails = this.getBankDetails();
        const paymentMethod = await this.tilledService.createPaymentMethod(false, bankDetails);
        console.log('Payment method created:', paymentMethod);
        await this.createCustomerAndAttachPM(paymentMethod.id);
      } catch (error) {
        console.error('Error in payment process:', error);
      }
    } else {
      console.error('Form is invalid');
    }
  }

  async confirmPayment(): Promise<void> {
    if (this.paymentMethodType === 'card' && this.cardPaymentForm.valid) {
      try {
        const cardDetails = this.getCardDetails();
        const clientSecret = (await this.fetchPaymentIntent()).client_secret;
        console.log('Client secret:', clientSecret);

        const confirmationResult = await this.tilledService.confirmPayment(clientSecret, true, cardDetails);
        console.log('Payment confirmed:', confirmationResult);
        if (confirmationResult?.status === 'succeeded') {
          this.receiptDetails = {
            merchantName: this.merchantName,
            items: this.products,
            tax: this.tax,
            total: this.total,
            paymentMethodDetails: confirmationResult?.payment_method?.card?.brand?.toUpperCase() + ' ' + confirmationResult?.payment_method?.card?.last4,
          };
          console.log('Payment confirmed:', confirmationResult);
        }
      } catch (error) {
        console.error('Error in payment process:', error);
      }
    } else if (this.paymentMethodType === 'ach_debit' && this.achDebitPaymentForm.valid) {
      try {
        const bankDetails = this.getBankDetails();
        const clientSecret = (await this.fetchPaymentIntent()).client_secret;
        console.log('Client secret:', clientSecret);

        const confirmationResult = await this.tilledService.confirmPayment(clientSecret, false, bankDetails);
        console.log('Payment confirmed:', confirmationResult);
        if (confirmationResult?.status === 'processing' || confirmationResult?.status === 'succeeded') {
          this.receiptDetails = {
            merchantName: this.merchantName,
            items: this.products,
            tax: this.tax,
            total: this.total,
            paymentMethodDetails:
              confirmationResult?.payment_method?.ach_debit?.account_type?.charAt(0).toUpperCase() +
              confirmationResult?.payment_method?.ach_debit?.account_type?.slice(1) +
              ' **' +
              confirmationResult?.payment_method?.ach_debit?.last2,
          };
        }
      } catch (error) {
        console.error('Error in payment process:', error);
      }
    } else {
      console.error('Form is invalid');
    }
    this.showReceipt = true;
  }

  // Fetch the payment intent from the backend
  private async fetchPaymentIntent(): Promise<any> {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    if (this.merchantAccountId) requestHeaders.set('tilled_account', this.merchantAccountId);
    const response = await fetch('/api/payment-intents', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        amount: Math.round(this.total * 100),
        currency: 'usd',
        payment_method_types: ['card', 'ach_debit'],
      }),
    });
    if (!response.ok) {
      throw new Error(`Unable to fetch payments from backend. Status: ${response.statusText}`);
    }
    return response.json();
  }

  private async createCustomerAndAttachPM(paymentMethodId: string): Promise<void> {
    const customerDetails = {
      first_name: this.cardPaymentForm.get('cardholderName').value.split(' ')[0],
      last_name: this.cardPaymentForm.get('cardholderName').value.split(' ')[1],
      metadata: {
        internal_customer_id: '12345', // You can set logic to generate a unique customer id or use the id from your system
      },
    };
    const paymentMethod = paymentMethodId;
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    if (this.merchantAccountId) requestHeaders.set('tilled_account', this.merchantAccountId);
    const customerResponse = await fetch('/api/customer', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        ...customerDetails,
      }),
    });
    if (!customerResponse.ok) {
      throw new Error(`Unable to create customer and payment method. Status: ${customerResponse.statusText}`);
    }

    const customer = await customerResponse.json();
    const pmAttach = await fetch('/api/payment-methods/' + paymentMethod + '/attach', {
      method: 'PUT',
      headers: requestHeaders,
      body: JSON.stringify({
        customer_id: customer.id,
      }),
    });
    if (!pmAttach.ok) {
      throw new Error(`Unable to attach payment method to customer. Status: ${pmAttach.statusText}`);
    }
    const pmData = await pmAttach.json();
    this.receiptDetails = {
      merchantName: this.merchantName,
      paymentMethodDetails:
        pmData.type === 'card'
          ? pmData.card.brand.toUpperCase() + ' ' + pmData.card.last4
          : pmData.ach_debit.account_type.charAt(0).toUpperCase() + pmData.ach_debit.account_type.slice(1) + ' **' + pmData.ach_debit.last2,
      customerName: customer.first_name + ' ' + (customer.last_name || ''),
    };
    this.showReceipt = true;
  }

  private getCardDetails(): any {
    const cardDetails = {
      name: this.cardPaymentForm.get('cardholderName').value,
      address: {
        country: this.cardPaymentForm.get('country').value,
        zip: this.cardPaymentForm.get('postalCode').value,
      },
    };
    Object.keys(cardDetails).forEach((key) => (cardDetails[key] == null || cardDetails[key] == '') && delete cardDetails[key]);
    return cardDetails;
  }

  private getBankDetails(): any {
    const bankDetails = {
      ach_debit: {
        account_holder_name: this.achDebitPaymentForm.get('accountholderName').value,
        account_type: this.achDebitPaymentForm.get('accountType').value,
      },
      billing_details: {
        address: {
          city: this.achDebitPaymentForm.get('city').value,
          country: this.achDebitPaymentForm.get('country').value,
          state: this.achDebitPaymentForm.get('state').value,
          street: this.achDebitPaymentForm.get('street1').value,
          street2: this.achDebitPaymentForm.get('street2').value,
          zip: this.achDebitPaymentForm.get('postalCode').value,
        },
      },
    };
    Object.keys(bankDetails.billing_details.address).forEach(
      (key) => (bankDetails.billing_details.address[key] == null || bankDetails.billing_details.address[key] == '') && delete bankDetails.billing_details.address[key]
    );
    return bankDetails;
  }

  // Teardown the Tilled payment form along with other form related data
  private teardownForm(): void {
    if (this.tilledCardForm) {
      this.tilledCardForm.teardown();
      this.tilledCardForm = false;
      this.cardPaymentForm.reset();
      this.savePaymentMethod = false;
    }
    if (this.tilledAchDebitForm) {
      this.tilledAchDebitForm.teardown();
      this.tilledAchDebitForm = false;
      this.achDebitPaymentForm.reset();
      this.savePaymentMethod = false;
    }
  }

  backToCheckout(): void {
    if (this.showReceipt) {
      this.showReceipt = false;
      window.location.reload();
    } else {
      this.showReceipt = true;
    }
  }

  // Event handlers for the form
  onPaymentMethodChange(paymentMethodType: string): void {
    this.setupPaymentForm(paymentMethodType);
  }

  onSavePaymentMethodToggle(event: MatSlideToggleChange): void {
    this.savePaymentMethod = event.checked;
  }

  onCountryChange(event: MatSelectChange): void {
    this.achDebitPaymentForm.get('country').setValue(event.value);
  }

  onStateChange(event: MatSelectChange): void {
    this.achDebitPaymentForm.get('state').setValue(event.value);
  }

  onAccountTypeChange(event: MatSelectChange): void {
    this.achDebitPaymentForm.get('accountType').setValue(event.value);
  }

  // Track tilled.js field changes and set the error state accordingly (used to show error message for each field)
  showTilledFieldError(data: any): void {
    if (data) {
      if (data.field === 'cardNumber') {
        this.showCardNumberError = data.invalid;
      } else if (data.field === 'cardExpiry') {
        this.showExpirationError = data.invalid;
      } else if (data.field === 'cardCvv') {
        this.showCvvError = data.invalid;
      } else if (data.field === 'bankAccountNumber') {
        this.showAccountNumberError = data.invalid;
      } else if (data.field === 'bankRoutingNumber') {
        this.showRoutingNumberError = data.invalid;
      }
    } else {
      return;
    }
  }
}
