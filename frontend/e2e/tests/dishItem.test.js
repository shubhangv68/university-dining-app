// const { test, expect } = require('@playwright/test');
// const DishItem = require('../../src/Components/DishItem');

// test('renders the dish name correctly', async ({ page }) => {
//   await page.setContent('<div id="root"></div>');
//   const dish = { name: 'Test Dish', avg_rating: 4.5 };
//   const component = new DishItem(dish);
//   await component.render(page, '#root');
//   const dishName = await page.locator('h3').textContent();
//   expect(dishName).toBe(dish.name);
// });

// test('renders the average rating correctly', async ({ page }) => {
//   await page.setContent('<div id="root"></div>');
//   const dish = { name: 'Test Dish', avg_rating: 4.5 };
//   const component = new DishItem(dish);
//   await component.render(page, '#root');
//   const avgRating = await page.locator('p:nth-of-type(2)').textContent();
//   expect(avgRating).toContain(`Rated 2.3★ by other users`);
// });

// test('opens the rating modal when clicking the rate button', async ({ page }) => {
//   await page.setContent('<div id="root"></div>');
//   const dish = { name: 'Test Dish', avg_rating: 4.5 };
//   const component = new DishItem(dish);
//   await component.render(page, '#root');
//   await page.locator('button').click();
//   const modalIsVisible = await page.locator('.rating-modal').isVisible();
//   expect(modalIsVisible).toBe(true);
// });

// test('submits a review and displays it', async ({ page }) => {
//   await page.setContent('<div id="root"></div>');
//   const dish = { name: 'Test Dish', avg_rating: 4.5 };
//   const component = new DishItem(dish);
//   await component.render(page, '#root');
//   await page.locator('button').click();
//   await page.locator('.rating-modal input[name="rating"]').fill('5');
//   await page.locator('.rating-modal textarea[name="comment"]').fill('Great dish!');
//   await page.locator('.rating-modal button[type="submit"]').click();
//   const userReview = await page.locator('p:nth-of-type(3)').textContent();
//   expect(userReview).toContain('Your Review: Great dish! & Rating: 5 ★');
// });

// test('opens the reviews modal when clicking the view reviews button', async ({ page }) => {
//     await page.setContent('<div id="root"></div>');
//     const dish = { name: 'Test Dish', avg_rating: 4.5, id: 1 };
//     const component = new DishItem(dish);
//     await component.render(page, '#root');
//     await page.locator('p:nth-of-type(3)').click();
//     const modalIsVisible = await page.locator('.reviews-modal').isVisible();
//     expect(modalIsVisible).toBe(true);
// });

// test('displays the correct number of reviews in the reviews modal', async ({ page }) => {
//     await page.setContent('<div id="root"></div>');
//     const dish = { name: 'Test Dish', avg_rating: 4.5, id: 1 };
//     const component = new DishItem(dish);
//     await component.render(page, '#root');
//     await page.locator('p:nth-of-type(3)').click();
//     const reviewCount = await page.locator('.reviews-modal.review').count();
//     expect(reviewCount).toBe(dish.reviews.length);
// });

// test('displays the correct review content in the reviews modal', async ({ page }) => {
//     await page.setContent('<div id="root"></div>');
//     const dish = { name: 'Test Dish', avg_rating: 4.5, id: 1, reviews: [{ rating: 5, comment: 'Great dish!' }] };
//     const component = new DishItem(dish);
//     await component.render(page, '#root');
//     await page.locator('p:nth-of-type(3)').click();
//     const reviewContent = await page.locator('.reviews-modal.review').textContent();
//     expect(reviewContent).toContain('Great dish!');
// });