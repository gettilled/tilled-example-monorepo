import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { TilledService } from '../../core/services/tilled.service';
import { ProductsList } from '../../utils/products-list';
import { SelectionTypes } from '../../utils/selection-types';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
  public savePaymentMethod = false;
  public stateCodeMap: Map<string, string>;
  public countryCodeMap: Map<string, string>;
  public accountTypeMap: Map<string, string>;
  public products = ProductsList.products;
  public taxRate = ProductsList.taxRate;
  public merchantName = environment.merchantName;
  public subtotal: number;
  public tax: number;
  public total: number;

  constructor(
    private formBuilder: FormBuilder,
    private tilledService: TilledService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.tilledService.loadTilledScript().then(() => {
      this.setupPaymentForm(this.paymentMethodType);
    });
    this.calculateTotal();
  }

  ngOnDestroy(): void {
    this.teardownForm();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private initializeForms(): void {
    this.cardPaymentForm = this.formBuilder.group({
      cardholderName: ['', Validators.nullValidator],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
    });

    this.achDebitPaymentForm = this.formBuilder.group({
      accountholderName: ['', Validators.required],
      accountType: ['', Validators.required],
      street1: ['', Validators.required],
      street2: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
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
        console.log('cardDetails: ', cardDetails);
        const paymentMethod = await this.tilledService.createPaymentMethod(true, cardDetails);
        console.log('Payment method created:', paymentMethod);
      } catch (error) {
        console.error('Error in payment process:', error);
      }
    } else if (this.paymentMethodType === 'ach_debit' && this.achDebitPaymentForm.valid) {
      try {
        const bankDetails = this.getBankDetails();
        const paymentMethod = await this.tilledService.createPaymentMethod(false, bankDetails);
        console.log('Payment method created:', paymentMethod);
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
      } catch (error) {
        console.error('Error in payment process:', error);
      }
    } else {
      console.error('Form is invalid');
    }
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
}
