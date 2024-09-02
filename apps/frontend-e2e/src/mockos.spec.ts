import { test, expect } from '@playwright/test';

const noTriggerOnboarding = async () => {
    localStorage.setItem('isOnboarded', 'true');
}

test.describe('(/mockos) Mockos - No onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(noTriggerOnboarding);
    await page.goto('/mockos');
  });

  test('should show title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('My Mockos');
  });

  test('should have link to repo', async ({ page }) => {
    await expect(page.locator('a[href="https://github.com/brainsaysno/mocko"]')).toBeVisible();
  });

  test('should show seed mocko card', async ({ page }) => {
    await expect(page.getByTestId("mocko-card")).toHaveCount(1);
  });

  test('should match snapshot', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('h1');
    // Wait for animations to finish
    await page.waitForTimeout(1000)
    expect(await page.screenshot()).toMatchSnapshot('mockos.png');
  });
  
  test('should be able to create new ai prose mocko', async ({ page }) => {
    const testMocko = {
        name: 'Short Product',
        content: 'A short product description',
        example: 'This is a short product description'
    };
    
    await expect(page.getByTestId("mocko-card")).toHaveCount(1);

    await page.getByText('New Mocko').click();
    console.log(page.url())
    await page.getByTestId('name-input').fill(testMocko.name);
    await page.getByTestId('content-input').fill(testMocko.content);
    await page.getByTestId('example-input').fill(testMocko.example);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByTestId("mocko-card")).toHaveCount(2);

    const newMocko = page.getByTestId("mocko-card").first();
    await expect (newMocko.getByText("AI Prose")).toBeVisible();
    await expect(newMocko.getByText(testMocko.name)).toBeVisible();
  });
  
  test('should be able to create new fixed mocko', async ({ page }) => {
    const testMocko = {
      name: 'Short Product',
      content: 'A short product description',
    }

    await expect(page.getByTestId("mocko-card")).toHaveCount(1);

    await page.getByText('New Mocko').click();
    
    await page.getByRole('tab', {name: 'Fixed'}).click();
    
    await page.getByTestId('name-input').fill(testMocko.name);
    await page.getByTestId('content-input').fill(testMocko.content);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByTestId("mocko-card")).toHaveCount(2);

    const newMocko = page.getByTestId("mocko-card").first();
    await expect (newMocko.getByText("Fixed")).toBeVisible();
    await expect(newMocko.getByText(testMocko.name)).toBeVisible();
  }) 
});
