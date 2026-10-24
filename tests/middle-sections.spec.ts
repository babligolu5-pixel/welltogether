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
  page.getByTestId('centre-card').nth(index).locator('.chip').allTextContents();

test.describe('hero', () => {
  test('TC-49 text and 3D visuals are both clear', async ({ page }) => {
    await page.goto('/');

    const panel = page.getByTestId('hero-panel');
    await expect(panel).toBeVisible();

    const styles = await panel.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { background: cs.backgroundColor, filter: cs.backdropFilter };
    });
    expect(styles.background).toBe('rgba(0, 0, 0, 0)');
    expect(styles.filter).toBe('none');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      /Find your calm/,
    );
    await expect(page.locator('[data-testid="hero-scene"] canvas, [data-testid="hero-scene"] [data-testid="hero-fallback"]').first()).toBeVisible();
  });

  test('TC-50 hero fits a 360px screen', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const cta = page.getByTestId('cta-explore');
    const box = await cta.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(240);
    expect(box!.height).toBeGreaterThanOrEqual(44);

    await expect(page.getByTestId('hero-slide')).toBeVisible();
  });

  test('TC-51 slides auto-advance and can be driven manually', async ({ page }) => {
    await page.goto('/');

    const counter = page.getByTestId('slide-counter');
    await expect(counter).toHaveText('1 / 4');
    await expect(counter).not.toHaveText('1 / 4', { timeout: 9000 });

    await page.getByTestId('carousel-pause').click();
    const current = await counter.innerText();
    await page.getByTestId('carousel-next').click();
    await expect(counter).not.toHaveText(current);
    await expect(page.getByTestId('carousel-dot')).toHaveCount(4);
  });

  test('TC-52 Explore Centres opens the listing', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('cta-explore').click();

    await expect(page).toHaveURL(/\/centres$/);
    await expect(page.getByTestId('centres-page')).toBeVisible();
    await expect(page.getByTestId('centre-card')).toHaveCount(12);
  });

  test('TC-53 the visual layer never blocks clicks', async ({ page }) => {
    await page.goto('/');

    const pointerEvents = await page
      .getByTestId('hero-scene')
      .evaluate((el) => getComputedStyle(el).pointerEvents);
    expect(pointerEvents).toBe('none');

    await page.getByTestId('cta-explore').click();
    await expect(page).toHaveURL(/\/centres$/);
  });
});

test.describe('explore services', () => {
  test('TC-54 exactly five categories, no Natural Wellness category', async ({ page }) => {
    await page.goto('/');

    const cards = page.getByTestId('category-card');
    await expect(cards).toHaveCount(5);

    const labels = await cards.locator('h3').allTextContents();
    expect(labels).toEqual(['Yoga', 'Meditation', 'Ayurveda', 'Panchkarma', 'Spa']);
    expect(labels).not.toContain('Natural Wellness');
  });

  test('TC-55 each category opens its own centres', async ({ page }) => {
    for (const category of CATEGORIES) {
      await page.goto('/');
      await page
        .getByTestId('category-card')
        .filter({ hasText: category.label })
        .first()
        .click();

      await expect(page).toHaveURL(new RegExp(`/services/${category.slug}$`));
      await expect(page.getByTestId('service-page')).toHaveAttribute(
        'data-service',
        category.slug,
      );
      await expect(page.getByTestId('centre-card').first()).toBeVisible();
    }
  });

  test('TC-56 Spa maps to Ayurvedic Spa centres', async ({ page }) => {
    await page.goto('/services/spa');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Spa');
    const count = await page.getByTestId('centre-card').count();
    expect(count).toBeGreaterThanOrEqual(3);

    for (let index = 0; index < count; index += 1) {
      expect(await cardChips(page, index)).toContain('Ayurvedic Spa');
    }
  });

  test('TC-58 category cards work from the keyboard', async ({ page }) => {
    await page.goto('/');

    const yoga = page.getByTestId('category-card').first();
    await yoga.focus();
    await expect(yoga).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/services\/yoga$/);
  });
});

test.describe('featured centres and profiles', () => {
  test('TC-59 card shows photo, details and actions', async ({ page }) => {
    await page.goto('/');

    const first = page.getByTestId('centre-card').first();
    const photo = first.getByTestId('centre-photo');
    await expect(photo).toBeVisible();
    await expect(photo).toHaveAttribute('alt', /, /);
    await expect(photo).toHaveAttribute('loading', 'lazy');

    await expect(first.locator('.centre-name')).toBeVisible();
    await expect(first.locator('.centre-city')).toBeVisible();
    await expect(first.locator('.chip').first()).toBeVisible();
    await expect(first.locator('.rating')).toBeVisible();
    await expect(first.locator('.price')).toContainText('₹');
    await expect(first.getByTestId('centre-view-profile')).toBeVisible();
    await expect(first.getByTestId('centre-enquire')).toBeVisible();
  });

  test('TC-60 cards keep their shape on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');

    const first = page.getByTestId('centre-card').first();
    const photo = first.getByTestId('centre-photo');
    await expect(photo).toBeVisible();

    const box = await photo.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(240);
    expect(box!.height / box!.width).toBeGreaterThan(0.7);
    expect(box!.height / box!.width).toBeLessThan(0.8);
  });

  test('TC-61 View Profile opens the matching centre', async ({ page }) => {
    await page.goto('/');

    const first = page.getByTestId('centre-card').first();
    const name = await first.locator('.centre-name').innerText();
    const id = await first.getAttribute('data-centre');

    await first.getByTestId('centre-view-profile').click();

    await expect(page).toHaveURL(new RegExp(`/centres/${id}$`));
    await expect(page.getByTestId('centre-profile')).toHaveAttribute('data-centre', id!);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
  });

  test('TC-62 every card opens its own profile', async ({ page }) => {
    await page.goto('/');

    const cards = page.getByTestId('centre-card');
    const total = await cards.count();

    for (let index = 0; index < total; index += 1) {
      await page.goto('/');
      const card = page.getByTestId('centre-card').nth(index);
      const name = await card.locator('.centre-name').innerText();
      await card.getByTestId('centre-view-profile').click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
    }
  });

  test('TC-63 the profile page shows every detail', async ({ page }) => {
    await page.goto('/centres/sattva-house');

    const profile = page.getByTestId('centre-profile');
    await expect(profile).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sattva House');
    await expect(profile).toContainText('Rishikesh');
    await expect(profile.getByTestId('centre-photo')).toBeVisible();
    await expect(profile.locator('.chip').first()).toBeVisible();
    await expect(profile.locator('.rating')).toBeVisible();
    await expect(profile.locator('.price')).toContainText('₹');
    await expect(profile.locator('.profile-note')).not.toBeEmpty();
    await expect(profile.getByTestId('centre-enquire')).toBeVisible();
    await expect(profile.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
  });

  test('TC-64 a broken photo falls back to a placeholder', async ({ page }) => {
    await page.route('**/centres/antar-maun.svg', (route) => route.abort());
    await page.goto('/centres/antar-maun');

    await expect(page.getByTestId('centre-photo-fallback')).toBeVisible();
    await expect(page.getByTestId('centre-profile')).toContainText('Antar Maun');
  });

  test('TC-65 enquiry from a profile is prefilled and submits', async ({ page }) => {
    await page.goto('/centres/sattva-house');
    await page.getByTestId('centre-enquire').click();

    await expect(page.getByTestId('enquiry-dialog')).toBeVisible();
    await expect(page.getByTestId('enquiry-dialog')).toContainText('Sattva House');
    await expect(page.getByTestId('enquiry-service')).toHaveValue('Yoga');

    await page.getByTestId('enquiry-name').fill('Profile Enquiry');
    await page.getByTestId('enquiry-email').fill(`profile+${Date.now()}@example.com`);
    await page.getByTestId('enquiry-message').fill(
      'Asking about the yoga programme mentioned on this profile.',
    );
    await page.getByTestId('enquiry-submit').click();
    await expect(page.getByTestId('enquiry-success')).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('how it works', () => {
  test('TC-66 exactly three ordered steps', async ({ page }) => {
    await page.goto('/');

    const list = page.getByTestId('steps');
    expect(await list.evaluate((el) => el.tagName)).toBe('OL');

    const steps = page.getByTestId('step');
    await expect(steps).toHaveCount(3);

    const titles = await steps.locator('h3').allTextContents();
    expect(titles).toEqual(['Find a centre', 'Compare profiles', 'Send an enquiry']);

    const numbers = await steps.locator('.step-index').allTextContents();
    expect(numbers).toEqual(['01', '02', '03']);
  });

  test('TC-67 steps stack on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');

    const columns = await page
      .getByTestId('steps')
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(1);
  });

  test('TC-68 steps form three columns on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const columns = await page
      .getByTestId('steps')
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(3);
  });
});

test.describe('layout and regressions', () => {
  for (const viewport of [
    { name: 'mobile', width: 360, height: 740, columns: 1 },
    { name: 'tablet', width: 768, height: 1024, columns: 2 },
    { name: 'desktop', width: 1280, height: 800, columns: 3 },
  ]) {
    test(`TC-57 grids at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      const categoryColumns = await page
        .getByTestId('category-grid')
        .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
      expect(categoryColumns).toBe(viewport.columns);

      const centreColumns = await page
        .getByTestId('centre-grid')
        .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
      expect(centreColumns).toBe(viewport.columns);
    });
  }

  test('TC-69 no navigation regressions', async ({ page }) => {
    for (const path of ['/', '/centres', '/services/yoga', '/centres/sattva-house']) {
      await page.goto(path);
      await expect(page.getByTestId('site-header')).toBeVisible();
    }

    await page.goto('/nope-not-here');
    await expect(page.getByTestId('not-found')).toBeVisible();
    await page.getByTestId('back-home').click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('TC-70 accessibility on the three key pages', async ({ page }) => {
    for (const path of ['/', '/centres', '/centres/sattva-house']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const blocking = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      );
      expect(blocking.map((violation) => `${path}: ${violation.id}`)).toEqual([]);
    }
  });

  test('TC-71 each page has a distinct title', async ({ page }) => {
    const routes = [
      { path: '/', expected: /Find Your Calm/ },
      { path: '/centres', expected: /Wellness Centres/ },
      { path: '/services/yoga', expected: /Yoga centres/ },
      { path: '/centres/sattva-house', expected: /Sattva House/ },
    ];

    const titles = new Set<string>();
    for (const route of routes) {
      await page.goto(route.path);
      await expect(page).toHaveTitle(route.expected);
      titles.add(await page.title());
    }

    expect(titles.size).toBe(routes.length);
  });
});
