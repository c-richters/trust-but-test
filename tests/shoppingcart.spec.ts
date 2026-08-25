import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Go to page and Expect heading to confirm
  await page.goto('https://practiceautomatedtesting.com/shopping');
  await expect(page.getByRole('heading', { name: 'E-commerce Testing Practice' })).toBeVisible();
  
  // Check if cart is empty
  await page.getByTestId('cart-button').click();
  await expect(page.getByRole('heading', { name: 'Shopping Cart & Checkout:' })).toBeVisible();
  await expect(page.getByTestId('checkout-modal').getByText('Your cart is empty')).toBeVisible();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  
  // Slight problem here: Deleting items from shopping cart does not seem possible.
  // normally i would use an  if else statement to check if the cart is empty and if not, delete the items in the cart. But since this is not possible, 
  // we will just check if the cart is empty and if not, we will just continue shopping.

  // Confirm we are back on the shopping page by checking the heading
  await expect(page.getByRole('heading', { name: 'E-commerce Testing Practice' })).toBeVisible();

  // Check if add to cart button on item level is visible and click
  await expect(page.getByTestId('add-to-cart-5')).toBeVisible();
  await page.getByTestId('add-to-cart-5').click();
  await expect(page.getByText('In cart: 1')).toBeVisible();
  // Check if item was added to shopping cart before clicking
  await expect(page.getByTestId('cart-button')).toContainText('$59.99');
  // To go shopping cart and confirm the item is there, click on the cart button and check if the heading is visible 
  // and the item is in the cart
  await page.getByTestId('cart-button').click();
  await expect(page.getByRole('heading', { name: 'Shopping Cart & Checkout:' })).toBeVisible();
  // Check if the item is in the cart and the quantity and price are correct
  await expect(page.getByText('Qty: 1 × $59.99')).toBeVisible();

  await page.getByTestId('billing-firstname').fill('Poseidon');
  await page.getByTestId('billing-lastname').fill('The');
  await page.getByTestId('billing-email').fill('no@e.mail');
  await page.getByTestId('billing-phone').fill('0641600025');
  await page.getByTestId('billing-address').fill('mythologischlaan 10');
  await page.getByTestId('billing-city').fill('Atlantis');
  await page.getByTestId('billing-zipcode').fill('0000AB');
  // There doesnt seem to be any validation on the billing info, so we can just fill in some random data
  // for the sake of this test i've used noraml data. In a real world scenario, we would want to test for validation as well.

  // Select Payment method and bank
  // All payment methods should be tested in different tests, but for the sake of this test, we will just test iDeal and select a bank.
  await page.getByTestId('payment-ideal').click();
  await page.getByTestId('ideal-bank').selectOption('abn');
  // Pay 
  await page.getByTestId('place-order').click();
  await expect(page.getByTestId('payment-success')).toBeVisible();
  await expect(page.getByText(('Payment Method:iDeal'))).toBeVisible();
  
  // Check if download works
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('download-invoice').click();
  
  const download = await downloadPromise;
  await page.getByTestId('payment-processing-modal').click();

  await page.close();
});