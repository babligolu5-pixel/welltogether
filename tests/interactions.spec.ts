import { test, expect, type Page } from '@playwright/test';

/**
 * Interaction coverage: every control must do something real.
 * Visibility alone is not enough — clicks, keyboard, focus and form state are
 * asserted here.
 */

const SECTION_LINKS = [
  { name: 'How It Works', id: 'how-it-works' },
  { name: 'Reviews', id: 'reviews' },
];

const SERVICES = [
  'Yoga',
  'Meditation',
  'Ayurveda',
  'Panchkarma',
  'Ayurvedic Spa',
  'Natural Wellness',
];

async function openCentreDialog(page: Page) {
  await page.getByTestId('centre-enquire').first().click();
  await expect(page.getByTestId('enquiry-dialog')).toBeVisible();
}

test.describe('navigation controls', () => {
  for (const link of SECTION_LINKS) {
    test(`header link "${link.name}" navigates to #${link.id}`, async ({ page }) => {
      await page.goto('/');

      await page
        .getByTestId('primary-nav')
        .getByRole('link', { name: link.name, exact: true })
        .click();

      await expect
        .poll(
          () =>
            page.evaluate(
              (id) => Math.abs(document.getElementById(id)?.getBoundingClientRect().top ?? 999),
              link.id,
            ),
          { timeout: 10_000 },
        )
        .toBeLessThanOrEqual(200);

      expect(await page.evaluate(() => window.location.hash)).toBe(`#${link.id}`);
    });
  }

  test('header "Find a Centre" opens the dialog and every close path works', async ({ page }) => {
    await page.goto('/');
    const dialog = page.getByTestId('enquiry-dialog');

    await page.locator('.header-cta').click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    await page.locator('.header-cta').click();
    await page.getByTestId('enquiry-close').click();
    await expect(dialog).toBeHidden();

    await page.locator('.header-cta').click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(6, 6); // backdrop
    await expect(dialog).toBeHidden();
  });

  test('every internal anchor points at a real section', async ({ page }) => {
    await page.goto('/');

    const hrefs = await page.locator('a[href*="#"]').evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('href') ?? ''),
    );

    expect(hrefs.length).toBeGreaterThanOrEqual(2);
    for (const href of hrefs) {
      const hash = href.slice(href.indexOf('#') + 1);
      expect(hash.length).toBeGreaterThan(0);
      await expect(page.locator(`#${hash}`)).toHaveCount(1);
    }
  });
});

test.describe('mobile menu', () => {
  test('hamburger opens, links close it, and scroll lands on the section', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Open menu' });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    const close = page.getByRole('button', { name: 'Close menu' });
    await expect(close).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('primary-nav')).toBeVisible();

    await page.getByTestId('primary-nav').getByRole('link', { name: 'Reviews' }).click();
    await expect(page.getByTestId('primary-nav')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});

test.describe('carousel controls', () => {
  test('prev, next, dots, pause and keyboard all change the slide', async ({ page }) => {
    await page.goto('/');
    const counter = page.getByTestId('slide-counter');

    await page.getByTestId('carousel-pause').click();
    await expect(page.getByTestId('carousel-pause')).toHaveAttribute('aria-pressed', 'true');

    await page.getByTestId('carousel-next').click();
    await expect(counter).toHaveText('2 / 4');
    await page.getByTestId('carousel-next').click();
    await expect(counter).toHaveText('3 / 4');
    await page.getByTestId('carousel-prev').click();
    await expect(counter).toHaveText('2 / 4');

    const dots = page.getByTestId('carousel-dot');
    await dots.nth(3).click();
    await expect(counter).toHaveText('4 / 4');
    await expect(dots.nth(3)).toHaveAttribute('aria-current', 'true');
    await expect(dots.nth(0)).toHaveAttribute('aria-current', 'false');

    // Wrap-around from the last slide.
    await page.getByTestId('carousel-next').click();
    await expect(counter).toHaveText('1 / 4');

    await page.getByTestId('hero-carousel').focus();
    await page.keyboard.press('ArrowLeft');
    await expect(counter).toHaveText('4 / 4');
  });

  test('pause toggles the autoplay state both ways', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('carousel-state')).toHaveText('playing');

    await page.getByTestId('carousel-pause').click();
    await expect(page.getByTestId('carousel-state')).toHaveText('paused');

    // Hovering or focusing the carousel also pauses autoplay, so move the
    // pointer away and move focus out before asserting the resumed state.
    await page.mouse.move(4, 4);
    await page.getByTestId('carousel-pause').click();
    await expect(page.getByTestId('carousel-pause')).toHaveAttribute('aria-pressed', 'false');
    await page.mouse.move(4, 4);
    await page.getByTestId('cta-explore').focus();
    await expect(page.getByTestId('carousel-state')).toHaveText('playing');
  });
});

test.describe('cards open a prefilled enquiry', () => {
  test('each service category preselects its own service', async ({ page }) => {
    await page.goto('/');

    for (let index = 0; index < SERVICES.length; index += 1) {
      await page.getByTestId('category-card').nth(index).click();
      const dialog = page.getByTestId('enquiry-dialog');
      await expect(dialog).toBeVisible();
      await expect(page.getByTestId('enquiry-service')).toHaveValue(SERVICES[index]);
      await page.getByTestId('enquiry-close').click();
      await expect(dialog).toBeHidden();
    }
  });

  test('a centre card carries its name and service into the dialog', async ({ page }) => {
    await page.goto('/');

    const firstCard = page.getByTestId('centre-card').first();
    const centreName = await firstCard.locator('.centre-name').innerText();
    const firstService = await firstCard.locator('.chip').first().innerText();

    await firstCard.getByTestId('centre-enquire').click();
    await expect(page.getByRole('dialog')).toContainText(centreName);
    await expect(page.getByTestId('enquiry-service')).toHaveValue(firstService);
  });
});

test.describe('enquiry form behaviour', () => {
  test('typing, invalid phone and inline errors react to input', async ({ page }) => {
    await page.goto('/');
    await openCentreDialog(page);

    // Autofocus lands on the first field.
    await expect(page.getByTestId('enquiry-name')).toBeFocused();

    await page.getByTestId('enquiry-name').fill('A');
    await page.getByTestId('enquiry-email').fill('nope@');
    await page.getByTestId('enquiry-phone').fill('12ab');
    await page.getByTestId('enquiry-message').fill('short');
    await page.getByTestId('enquiry-submit').click();

    await expect(page.getByTestId('error-name')).toContainText('at least 2');
    await expect(page.getByTestId('error-email')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('at least 10');
    await expect(page.getByTestId('enquiry-error')).toHaveCount(0); // local validation, not a server error

    // Fixing a field clears its error on the next attempt.
    await page.getByTestId('enquiry-name').fill('Ananya Rao');
    await page.getByTestId('enquiry-email').fill('ananya@example.com');
    await page.getByTestId('enquiry-phone').fill('');
    await page.getByTestId('enquiry-message').fill('Looking for a Panchkarma programme in Pune.');
    await page.getByTestId('enquiry-submit').click();
    await expect(page.getByTestId('enquiry-success')).toBeVisible({ timeout: 10_000 });
  });

  test('success state, disabled submit and duplicate-submit guard', async ({ page }) => {
    await page.goto('/');
    await openCentreDialog(page);

    await page.getByTestId('enquiry-name').fill('E2E Interaction');
    await page.getByTestId('enquiry-email').fill(`interaction+${Date.now()}@example.com`);
    await page.getByTestId('enquiry-message').fill(
      'Verifying the submit button, pending state and success view.',
    );

    await page.getByTestId('enquiry-submit').click();
    await expect(page.getByTestId('enquiry-submit')).toBeDisabled();
    await expect(page.getByTestId('enquiry-success')).toBeVisible({ timeout: 10_000 });

    await page.getByTestId('enquiry-close').click();
    await openCentreDialog(page);
    await page.getByTestId('enquiry-name').fill('E2E Interaction');
    await page.getByTestId('enquiry-email').fill('second@example.com');
    await page.getByTestId('enquiry-message').fill('Second submit should be rate limited.');
    await page.getByTestId('enquiry-submit').click();
    await expect(page.getByTestId('enquiry-error')).toContainText('before sending another enquiry');
  });

  test('dialog focus lands in the form and Escape closes it', async ({ page }) => {
    await page.goto('/');
    await openCentreDialog(page);

    // Autofocus is what makes keyboard entry start inside the dialog.
    await expect(page.getByTestId('enquiry-name')).toBeFocused();

    const order: string[] = [];
    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press('Tab');
      const id = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        return el?.dataset?.testid ?? el?.id ?? el?.tagName ?? '';
      });
      if (id) order.push(id);
    }

    expect(order).toContain('enquiry-email');
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('enquiry-dialog')).toBeHidden();
  });
});
