import { test, expect } from 'playwright/test'

test.describe('CartPage', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('**/api/cart', route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify([
                    { id: 1, item: 'Product 1', quantity: 2 },
                    { id: 2, item: 'Product 2', quantity: 1 }
                ])
            });
        });
        await page.goto('http://localhost:5173/cart');
        await page.waitForTimeout(2000); // Adjust if needed
    });

    test('renders cart items', async ({ page }) => {
        const product1Locator = page.locator('text=Product 1');
        const product2Locator = page.locator('text=Product 2');

        await expect(product1Locator).toBeVisible();
        await expect(product2Locator).toBeVisible();
    });

    test('calls remove item from list', async ({ page }) => {
        await page.route('**/api/cart/1', route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({ message: 'Item removed' })
            });
        });
        await page.click('text=Remove');
        await page.waitForTimeout(500); // Adjust if needed
        await expect(page.locator('text=Item removed')).toBeVisible();
    });

    test('calls update quantity function and updates cart list', async ({ page }) => {
        await page.route('**/api/cart', route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({ message: 'Quantity updated' }),
            });
        });
        await page.click('text=Increase');
        await page.waitForTimeout(500); // Adjust if needed
        await expect(page.locator('text=Quantity updated')).toBeVisible();
    });

    test('redirects to OrderPage on place order click', async ({ page }) => {
        await page.click('text=Place Order');
        await page.waitForTimeout(500); // Adjust if needed
        await expect(page).toHaveURL('http://localhost:5173/order');
    });
});
