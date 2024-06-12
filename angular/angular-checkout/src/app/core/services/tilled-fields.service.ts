import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TilledFieldsService {
  // Define the styles for the Tilled fields
  public FieldOptions = {
    styles: {
      base: {
        fontFamily: 'Open Sans, sans-serif',
        color: '#1B253B',
        fontWeight: '500',
        fontSize: '14px',
        letterSpacing: '0',
        '::placeholder': {
          fontWeight: '550',
          fontSize: '14px',
          color: 'rgba(102, 102, 102, 0.7)',
        },
      },
      invalid: {
        ':hover': {
          textDecoration: 'underline dotted #fb5638',
        },
        color: '#fb5638',
        '::placeholder': {
          color: '#fb5638',
        },
      },
      valid: {
        color: '#03a9f4',
      },
    },
  };
  private fieldChangeEmitter = new EventEmitter<any>();
  public fieldChange$ = this.fieldChangeEmitter.asObservable();

  emitFieldChange(data: any) {
    this.fieldChangeEmitter.emit(data);
  }

  getPlaceholderForField(field: string): string {
    const placeholders = {
      cardNumber: '0000 0000 0000 0000',
      cardExpiry: 'MM/YY',
      cardCvv: 'CVV',
      bankAccountNumber: 'Account Number',
      bankRoutingNumber: 'Routing Number',
    };
    return placeholders[field] || '';
  }

  getElementIdsForField(field: string): string[] {
    const elementIds = {
      cardNumber: 'card-number-element',
      cardExpiry: 'card-expiration-element',
      cardCvv: 'card-cvv-element',
      bankAccountNumber: 'bank-account-number-element',
      bankRoutingNumber: 'bank-routing-number-element',
    };
    return [elementIds[field]];
  }

  // Setup Event Listeners for the Tilled fields to toggle the success/error classes and update the card brand icon

  setupFieldEventListeners(field: any, fieldType: string): void {
    field.on('change', (change?: { brand?: string }) => {
      field.element.classList.toggle('success', field.valid);
      field.element.classList.toggle('error', !field.valid);

      if (fieldType === 'cardNumber' && change?.brand) {
        this.updateCardBrandIcon(change.brand);
      }
      this.emitFieldChange({ field: fieldType, invalid: field.invalid });
    });

    field.on('focus', () => {
      field.element.classList.add('focus');
    });

    field.on('blur', () => {
      field.element.classList.remove('focus');
      field.element.classList.toggle('success', field.valid);
      field.element.classList.toggle('error', !field.valid);
      this.emitFieldChange({ field: fieldType, invalid: field.invalid });
    });
  }

  private updateCardBrandIcon(brand: string): void {
    const cardSuffix = document.getElementById('card-suffix');
    if (!cardSuffix) {
      console.error('Card suffix element not found');
      return;
    }
    cardSuffix.innerHTML = this.getCardBrandIcon(brand);
  }

  private getCardBrandIcon(brand: string): string {
    const icons = {
      amex: '../../../assets/card-brands/amex.tif.svg',
      mastercard: '../../../assets/card-brands/mastercard.tif.svg',
      visa: '../../../assets/card-brands/visa.tif.svg',
      discover: '../../../assets/card-brands/discover.tif.svg',
    };

    const iconSrc = icons[brand] || icons['default'];
    switch (brand) {
      default: {
        return brand === 'default' || !iconSrc
          ? `<mat-icon role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font">credit_card</mat-icon>`
          : `<img class="p-0" src="${iconSrc}" />`;
      }
      case 'visa': {
        return `<img class="-m-1.5" src="${iconSrc}" />`;
      }
    }
  }
}
