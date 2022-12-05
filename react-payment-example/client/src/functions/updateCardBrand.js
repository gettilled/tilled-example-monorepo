async function updateCardBrand(cardNumberField) {
    cardNumberField.on('change', (evt) => {
        const cardBrand = evt.brand;
        const icon = document.getElementById('card-brand-icon');
      
        switch (cardBrand) {
          case 'amex': 
            icon.classList = 'fa fa-cc-amex'; break;
          case 'mastercard':
            icon.classList = 'fa fa-cc-mastercard'; break;
          case 'visa':
            icon.classList = 'fa fa-cc-visa'; break;
          case 'discover':
            icon.classList = 'fa fa-cc-discover'; break;
          case 'diners':
            icon.classList = 'fa fa-cc-diners-club'; break;
          default:
            icon.classList = '';
        }
      });
}

export default updateCardBrand;