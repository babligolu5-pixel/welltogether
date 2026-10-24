import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const CATEGORIES = [
  { slug: 'yoga', label: 'Yoga', service: 'Yoga' },
  { slug: 'meditation', label: 'Meditation', service: 'Meditation' },
  { slug: 'ayurveda', label: 'Ayurveda', service: 'Ayurveda' },
  { slug: 'panchkarma', label: 'Panchkarma', service: 'Panchkarma' },
  { slug: 'spa', label: 'Spa', service: 'Ayurvedic Spa' },
];

const cardChips = async (page: Page, index: number) =>
  page
    .getByTestId('centre-card')
    .nth(index)
    .locator('.chip')
    .allTextContents();

test.describe('wordmark / home', () => {
  test('TC-1 wordmark returns home from a sub-page', async ({ page }) => {
    await page.goto('/centres');
    await page.getByTestId('wordmark').click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId('hero')).toBeVisible();
  });

  test('TC-2 wordmark on home scrolls to the top', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.getByTestId('wordmark').click();

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('TC-3 wordmark has an accessible name and works from the keyboard', async ({ page }) => {
    await page.goto('/centres');

    const link = page.getByRole('link', { name: 'WellTogether', exact: true });
    await expect(link).toBeVisible();
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('explore centres', () => {
  test('TC-4 opens the centre listing with every card field', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-explore-centres').click();

    await expect(page).toHaveURL(/\/centres$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Wellness centres');

    const cards = page.getByTestId('centre-card');
    await expect(cards).toHaveCount(12);

    const first = cards.first();
    await expect(first.locator('.centre-name')).toBeVisible();
    await expect(first.locator('.centre-city')).toBeVisible();
    await expect(first.locator('.chip').first()).toBeVisible();
    await expect(first.locator('.rating')).toBeVisible();
    await expect(first.locator('.price')).toContainText('₹');
    await expect(first.getByText('Demo', { exact: true })).toBeVisible();
  });

  test('TC-5 the listing works as a direct deep link', async ({ page }) => {
    await page.goto('/centres');
    await expect(page.getByTestId('centres-page')).toBeVisible();
    await expect(page.getByTestId('centre-card').first()).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('centres-page')).toBeVisible();
    await expect(page.getByTestId('centre-card')).toHaveCount(12);
  });

  test('TC-6 the active page is marked in the header', async ({ page }) => {
    await page.goto('/centres');
    await expect(page.getByTestId('nav-explore-centres')).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.getByTestId('demo-note')).toContainText('sample data');
  });
});

test.describe('services menu', () => {
  test('TC-7 the menu shows exactly the five categories', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('services-trigger').click();

    await expect(page.getByTestId('services-menu')).toBeVisible();
    await expect(page.getByRole('menuitem')).toHaveCount(5);

    for (const category of CATEGORIES) {
      await expect(
        page.getByRole('menuitem', { name: category.label, exact: true }),
      ).toBeVisible();
    }
  });

  test('TC-8 Yoga shows only centres that offer Yoga', async ({ page }) => {
    await page.goto('/services/yoga');

    await expect(page.getByTestId('service-page')).toHaveAttribute('data-service', 'yoga');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Yoga');

    const cards = page.getByTestId('centre-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);

    for (let index = 0; index < count; index += 1) {
      expect(await cardChips(page, index)).toContain('Yoga');
    }
  });

  test('TC-9 every category page filters correctly', async ({ page }) => {
    for (const category of CATEGORIES) {
      await page.goto(`/services/${category.slug}`);
      await expect(page.getByTestId('service-page')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toContainText(category.label);

      const cards = page.getByTestId('centre-card');
      const count = await cards.count();
      expect(count, `${category.slug} should list at least 3 centres`).toBeGreaterThanOrEqual(3);

      for (let index = 0; index < count; index += 1) {
        expect(await cardChips(page, index)).toContain(category.service);
      }
    }
  });

  test('TC-10 outside click and Escape close the menu', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('services-trigger').click();
    await expect(page.getByTestId('services-menu')).toBeVisible();
    await page.mouse.click(6, 6);
    await expect(page.getByTestId('services-menu')).toBeHidden();
    await expect(page.getByTestId('services-trigger')).toHaveAttribute('aria-expanded', 'false');

    await page.getByTestId('services-trigger').click();
    await expect(page.getByTestId('services-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('services-menu')).toBeHidden();
    await expect(page.getByTestId('services-trigger')).toBeFocused();
  });

  test('TC-11 arrow keys move through the menu and Enter navigates', async ({ page }) => {
    await page.goto('/');

    const trigger = page.getByTestId('services-trigger');
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('services-menu')).toBeVisible();

    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Yoga', exact: true })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Meditation', exact: true })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Ayurveda', exact: true })).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/services\/ayurveda$/);
    await expect(page.getByTestId('service-page')).toHaveAttribute(
      'data-service',
      'ayurveda',
    );
  });

  test('TC-12 category pages work as deep links', async ({ page }) => {
    await page.goto('/services/ayurveda');

    await expect(page.getByTestId('service-page')).toHaveAttribute(
      'data-service',
      'ayurveda',
    );
    await expect(page.getByTestId('centre-card').first()).toBeVisible();

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });
});

test.describe('routing', () => {
  test('TC-13 unknown routes show a working 404 page', async ({ page }) => {
    await page.goto('/random-xyz');

    await expect(page.getByTestId('not-found')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('detour');

    await page.getByTestId('back-home').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId('hero')).toBeVisible();
  });

  test('TC-14 the header is consistent on every page', async ({ page }) => {
    for (const path of ['/', '/centres', '/services/yoga']) {
      await page.goto(path);
      await expect(page.getByTestId('site-header')).toBeVisible();
      await expect(page.getByTestId('wordmark')).toBeVisible();
      await expect(page.getByTestId('nav-explore-centres')).toBeVisible();
      await expect(page.getByTestId('services-trigger')).toBeVisible();
    }

    await page.goto('/services/yoga');
    await page.setViewportSize({ width: 360, height: 740 });
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByTestId('primary-nav')).toBeVisible();
    await page.getByRole('button', { name: 'Close menu' }).click();
    await expect(page.getByTestId('primary-nav')).toBeHidden();
  });

  test('TC-15 the enquiry flow still works from a category page', async ({ page }) => {
    await page.goto('/services/yoga');
    await page.getByTestId('centre-enquire').first().click();

    const dialog = page.getByTestId('enquiry-dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByTestId('enquiry-service')).toHaveValue('Yoga');

    await page.getByTestId('enquiry-name').fill('Header Nav Check');
    await page.getByTestId('enquiry-email').fill(`nav+${Date.now()}@example.com`);
    await page.getByTestId('enquiry-message').fill(
      'Checking the enquiry flow from a category page.',
    );
    await page.getByTestId('enquiry-submit').click();
    await expect(page.getByTestId('enquiry-success')).toBeVisible({ timeout: 20_000 });
  });

  test('TC-18 each page has its own metadata', async ({ page }) => {
    const routes = [
      { path: '/', expected: /Find Your Calm/ },
      { path: '/centres', expected: /Wellness Centres/ },
      { path: '/services/yoga', expected: /Yoga centres/ },
      { path: '/services/spa', expected: /Spa centres/ },
    ];

    const titles = new Set<string>();

    for (const route of routes) {
      await page.goto(route.path);
      await expect(page).toHaveTitle(route.expected);

      const title = await page.title();
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content');

      expect(title.length).toBeGreaterThan(10);
      expect(description?.length ?? 0).toBeGreaterThan(20);
      titles.add(title);
    }

    expect(titles.size).toBe(routes.length);
  });
});

test.describe('responsive and data', () => {
  for (const viewport of [
    { name: 'mobile', width: 360, height: 740, columns: 1 },
    { name: 'tablet', width: 768, height: 1024, columns: 2 },
    { name: 'desktop', width: 1280, height: 800, columns: 3 },
  ]) {
    test(`TC-16 listing layout at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const path of ['/centres', '/services/yoga']) {
        await page.goto(path);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);

        const columns = await page
          .getByTestId('centre-grid')
          .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
        expect(columns).toBe(viewport.columns);
      }
    });
  }

  test('TC-17 the mobile menu opens the services accordion', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByTestId('services-trigger').click();
    await expect(page.getByTestId('services-menu')).toBeVisible();
    await expect(page.getByRole('menuitem')).toHaveCount(5);

    await page.getByRole('menuitem', { name: 'Yoga', exact: true }).click();
    await expect(page).toHaveURL(/\/services\/yoga$/);
    await expect(page.getByTestId('primary-nav')).toBeHidden();
  });

  test('TC-19 accessibility scan on the new pages', async ({ page }) => {
    for (const path of ['/centres', '/services/yoga']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const blocking = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      );
      expect(
        blocking.map((violation) => `${path}: ${violation.id}`),
      ).toEqual([]);
    }
  });

  test('TC-20 dataset integrity holds', async ({ page }) => {
    await page.goto('/centres');

    const knownServices = [
      'Yoga',
      'Meditation',
      'Ayurveda',
      'Panchkarma',
      'Ayurvedic Spa',
      'Natural Wellness',
    ];

    const chips = await page.locator('[data-testid="centre-card"] .chip').allTextContents();
    expect(chips.length).toBeGreaterThan(0);
    for (const chip of chips) {
      expect(knownServices).toContain(chip.trim());
    }

    // "Spa" maps to the Ayurvedic Spa service.
    await page.goto('/services/spa');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Spa');
    const count = await page.getByTestId('centre-card').count();
    for (let index = 0; index < count; index += 1) {
      expect(await cardChips(page, index)).toContain('Ayurvedic Spa');
    }
  });
});
