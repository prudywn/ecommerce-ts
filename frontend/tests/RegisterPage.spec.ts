import { test, expect } from 'playwright/test';

test.describe('RegisterPage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/register');
  });

  test('calls register function with valid inputs', async ({ page }) => {
    await page.route('**/api/register', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ message: 'Registration successful' }),
      });
    });

    await page.fill('input[placeholder="Name"]', 'Test User');
    await page.fill('input[placeholder="Email"]', 'test@example.com');
    await page.fill('input[placeholder="Password"]', 'password');
    await page.click('button:has-text("Register")');

    await expect(page).toHaveURL('http://localhost:5173/register');
  });
});
