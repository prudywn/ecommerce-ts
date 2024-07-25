import { test, expect } from 'playwright/test';

test.describe('LoginPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
  });

  test('calls login function with valid inputs', async ({ page }) => {
    await page.route('**/api/login', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ message: 'Login successful', token: 'mockToken' }),
      });
    });

    await page.fill('input[placeholder="Email"]', 'test@example.com');
    await page.fill('input[placeholder="Password"]', 'password');
    await page.click('button:has-text("Login")');

    await expect(page).toHaveURL('http://localhost:5173/login');
  });
});
