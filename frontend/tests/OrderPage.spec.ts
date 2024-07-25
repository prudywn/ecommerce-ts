import { test, expect } from 'playwright/test';

test.describe('OrderPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/orders', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          { id: 1, item: 'Product 1', quantity: 2 },
          { id: 2, item: 'Product 2', quantity: 1 },
        ]),
      });
    });
    await page.goto('http://localhost:5173/order');
  });

  test('renders orders', async ({ page }) => {
    await expect(page.locator('text=Product 1')).toBeVisible();
    await expect(page.locator('text=Product 2')).toBeVisible();
  });

  test('calls createOrder function and updates orders list', async ({ page }) => {
    await page.route('**/api/orders/orders', route => {
      route.fulfill({
        status: 201,
        body: JSON.stringify({ message: 'Order placed successfully' }),
      });
    });

    await page.click('text=Place Order');
    await expect(page.locator('text=Order placed successfully')).toBeVisible();
  });

  test('calls deleteOrder function and updates orders list', async ({ page }) => {
    await page.route('**/api/orders/1', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ message: 'Order deleted' }),
      });
    });

    await page.click('text=Delete');
    await expect(page.locator('text=Order deleted')).toBeVisible();
  });
});
