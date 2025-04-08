import { test, expect } from '@playwright/test';
import {
  generateRegexFromArray,
  DelimiterEnum
} from '@dpatt/delimiterized-regex-builder';

const sleepFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

test.beforeAll(async () => {
  await sleepFor(5000);
});

test('creates a new payment intent', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('cart-summary-container')).toBeVisible();
});

test('create and confirm a payment intent with a new card payment method', async ({
  page
}) => {
  await page.goto('/');

  const consoleMsgArr: string[] = [];

  // Listen for all console logs and push them to the consoleMsgArr
  page.on('console', (msg) => consoleMsgArr.push(msg.text()));

  // Fail the test if there is an error
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log(`Error text: "${msg.text()}"`);
    expect(msg.type()).not.toBe('error');
  });

  // Fill out the billing details form
  await page.getByLabel('Full Name').fill('Testy McTesterson');
  await page.getByLabel('Address').fill('123 Test St');
  await page.getByLabel('Country').click();
  await page.getByRole('option', { name: 'United States' }).click();
  await page
    .getByTestId('billing-details-state-element')
    .getByLabel('State')
    .click();
  await page.getByRole('option', { name: 'Alaska' }).click();
  await page.getByLabel('City').fill('Test City');
  await page.getByLabel('ZIP').click();
  await page.getByLabel('ZIP').fill('12345');
  await page.getByTestId('card-number-element').click();
  await page
    .frameLocator('iframe[name="tilled_iframe_cardNumber"]')
    .getByLabel('Card number')
    .click();
  await page
    .frameLocator('iframe[name="tilled_iframe_cardNumber"]')
    .getByLabel('Card number')
    .fill('4111111111111111');
  await page
    .frameLocator('iframe[name="tilled_iframe_cardExpiry"]')
    .getByPlaceholder('MM / YY')
    .click();
  await page
    .frameLocator('iframe[name="tilled_iframe_cardExpiry"]')
    .getByPlaceholder('MM / YY')
    .fill('12 / 34');
  await page
    .frameLocator('iframe[name="tilled_iframe_cardCvv"]')
    .getByLabel('CVV')
    .click();
  await page
    .frameLocator('iframe[name="tilled_iframe_cardCvv"]')
    .getByLabel('CVV')
    .fill('123');
  await page.getByTestId('submit-button').click();

  // Wait for the payment intent to be confirmed
  await page.waitForResponse('**/confirm');

  // expect console.log to show the payment intent status
  // this confirms that we were able to successfully confirm the payment intent
  expect(consoleMsgArr.join('\n')).toMatch(
    generateRegexFromArray(
      [
        'creating new pm card {name: Testy McTesterson, address: Object}',
        'new pm {ach_debit: null, billing_details: Object, card_present: null, chargeable: true, created_at:',
        'attaching pm to customer {ach_debit: null, billing_details: Object, card_present: null, chargeable: true, created_at:',
        'using saved pm {ach_debit: null, billing_details: Object, card_present: null, chargeable: true, created_at:'
      ],
      DelimiterEnum.wildcards
    )
  );
});

test('confirm a payment intent with a saved card payment method', async ({
  page
}) => {
  await page.goto('/');

  const consoleMsgArr: string[] = [];

  // Listen for all console logs and push them to the consoleMsgArr
  page.on('console', (msg) => consoleMsgArr.push(msg.text()));

  // Fail the test if there is an error
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log(`Error text: "${msg.text()}"`);
    expect(msg.type()).not.toBe('error');
  });

  // expect payment method select to be visible and select the saved card payment method
  await expect(page.getByTestId('payment-form-container')).toBeVisible();
  await page.getByTestId('payment-method-select').click();
  await page.getByTestId('pm-option-visa-1111').click(); // this element is dynamically generated. It's not in the initial HTML

  // submit the payment form
  page.getByTestId('submit-button').click();

  // wait for response from both calls to the subscriptions endpoint
  await page.waitForResponse('**/subscriptions');
  await page.waitForResponse('**/subscriptions');
  await page.waitForTimeout(100); // wait for the console logs to be printed

  // expect console.log to show the payment intent status
  // this confirms that we were able to successfully create the subscription
  expect(consoleMsgArr.join('\n')).toMatch(
    generateRegexFromArray(
      [
        'Processing payment with selected pm: pm_',
        'confirmed payment',
        'creating subscriptions',
        'subscription created for sub_',
        'subscription created for sub_'
      ],
      DelimiterEnum.wildcards
    )
  );
});
