import { test, expect, type Page } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile', width: 360, height: 740 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

async function openEnquiry(page: Page) {
  await page.getByTestId('centre-enquire').first().click();
  await expect(page.getByTestId('enquiry-dialog')).toBeVisible();
}

async function fillValidEnquiry(page: Page, email: string) {
  await page.getByTestId('enquiry-name').fill('Ananya Rao');
  await page.getByTestId('enquiry-email').fill(email);
  await page.getByTestId('enquiry-message').fill(
    'I would like to know about a five day Panchkarma programme in November.',
  );
}

function contrastRatio(hexA: string, hexB: string) {
  const lum = (hex: string) => {
    const clean = hex.replace('#', '');
    const parts = [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16) / 255);
    const [r, g, b] = parts.map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const a = lum(hexA);
  const b = lum(hexB);
  const light = Math.max(a, b);
  const dark = Math.min(a, b);
  return (light + 0.05) / (dark + 0.05);
}

test.describe('hero layout and composition', () => {
  for (const viewport of VIEWPORTS) {
    test(`TC-1 hero starts directly under the header — ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      const header = await page.getByTestId('site-header').boundingBox();
      const hero = await page.getByTestId('hero').boundingBox();

      expect(header).not.toBeNull();
      expect(hero).not.toBeNull();
      expect(Math.abs(hero!.y - header!.height)).toBeLessThanOrEqual(2);
    });
  }

  test('TC-2 hero scene is full-bleed, unframed and non-interactive', async ({ page }) => {
    await page.goto('/');

    const scene = page.getByTestId('hero-scene');
    await expect(scene).toBeVisible();

    const styles = await scene.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        pointerEvents: cs.pointerEvents,
        border: `${cs.borderTopWidth} ${cs.borderLeftWidth}`,
        boxShadow: cs.boxShadow,
      };
    });

    expect(styles.pointerEvents).toBe('none');
    expect(styles.border).toBe('0px 0px');
    expect(styles.boxShadow).toBe('none');

    const box = await scene.boundingBox();
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - viewportWidth)).toBeLessThanOrEqual(1);

    await expect(
      page
        .locator('[data-testid="hero-scene"] canvas, [data-testid="hero-fallback"]')
        .first(),
    ).toBeVisible();
  });

  test('TC-3 the visual layer does not block the hero CTAs', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('cta-explore')).toBeVisible();
    await expect(page.getByTestId('cta-find-centre')).toBeVisible();

    // A real click fails if the canvas intercepted the pointer event.
    await page.getByTestId('cta-explore').click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(50);
  });

  test('TC-4 reduced motion renders a static, lightweight scene', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const scene = page.getByTestId('hero-scene');
    await expect(scene).toHaveAttribute('data-motion', 'static');
    await expect(scene).toHaveAttribute('data-quality', 'low');
    await expect(page.getByTestId('carousel-pause')).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('frosted panel and carousel', () => {
  test('TC-5 panel shows heading, description and at least three slides', async ({ page }) => {
    await page.goto('/');

    const panel = page.getByTestId('hero-panel');
    await expect(panel).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const filter = await panel.evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(filter).toContain('blur');

    await expect(page.getByTestId('hero-slide')).toHaveCount(1);
    await expect(page.getByTestId('carousel-dot')).toHaveCount(4);
    await expect(page.getByTestId('slide-counter')).toHaveText('1 / 4');
  });

  test('TC-6 manual navigation changes the active slide', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('carousel-pause').click();

    await page.getByTestId('carousel-next').click();
    await expect(page.getByTestId('slide-counter')).toHaveText('2 / 4');

    await page.getByTestId('carousel-prev').click();
    await expect(page.getByTestId('slide-counter')).toHaveText('1 / 4');

    await page.getByTestId('carousel-dot').nth(2).click();
    await expect(page.getByTestId('slide-counter')).toHaveText('3 / 4');

    await page.getByTestId('hero-carousel').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('slide-counter')).toHaveText('4 / 4');
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByTestId('slide-counter')).toHaveText('3 / 4');
  });

  test('TC-7 autoplay can be paused and resumed', async ({ page }) => {
    await page.goto('/');

    // Slide changes on a 6s interval; this asserts the play state that drives it.
    await expect(page.getByTestId('carousel-state')).toHaveText('playing');

    await page.getByTestId('carousel-pause').click();
    await expect(page.getByTestId('carousel-pause')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('carousel-state')).toHaveText('paused');

    await page.getByTestId('carousel-pause').click();
    await expect(page.getByTestId('carousel-pause')).toHaveAttribute('aria-pressed', 'false');
  });
});

test.describe('design tokens', () => {
  test('TC-8 palette tokens are applied and action contrast passes AA', async ({ page }) => {
    await page.goto('/');

    const tokens = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const read = (name: string) => cs.getPropertyValue(name).trim().toLowerCase();
      return {
        ivory: read('--color-ivory'),
        sage: read('--color-sage'),
        dustyBlue: read('--color-dusty-blue'),
        taupe: read('--color-taupe'),
        olive: read('--color-olive'),
      };
    });

    expect(tokens.ivory).toBe('#f7f2e8');
    expect(tokens.sage).toBe('#9caf88');
    expect(tokens.dustyBlue).toBe('#7c94a6');
    expect(tokens.taupe).toBe('#c8b9a9');
    expect(tokens.olive).toBe('#5f6b45');

    expect(contrastRatio('#ffffff', tokens.olive)).toBeGreaterThanOrEqual(4.5);
  });

  test('TC-9 primary actions use Muted Olive', async ({ page }) => {
    await page.goto('/');

    const explore = await page
      .getByTestId('cta-explore')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(explore).toBe('rgb(95, 107, 69)');

    await openEnquiry(page);
    const submit = await page
      .getByTestId('enquiry-submit')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(submit).toBe('rgb(95, 107, 69)');
  });
});

test.describe('hero calls to action', () => {
  test('TC-10 CTAs scroll to their sections and are large enough', async ({ page }) => {
    await page.goto('/');

    const explore = page.getByTestId('cta-explore');
    const findCentre = page.getByTestId('cta-find-centre');

    for (const button of [explore, findCentre]) {
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }

    await explore.click();
    await expect
      .poll(
        () =>
          page.evaluate(
            () => Math.abs(document.getElementById('services')?.getBoundingClientRect().top ?? 999),
          ),
        { timeout: 10000 },
      )
      .toBeLessThanOrEqual(100);

    await page.evaluate(() => window.scrollTo(0, 0));
    await findCentre.click();
    await expect
      .poll(
        () =>
          page.evaluate(
            () => Math.abs(document.getElementById('centres')?.getBoundingClientRect().top ?? 999),
          ),
        { timeout: 10000 },
      )
      .toBeLessThanOrEqual(100);
  });
});

test.describe('content sections', () => {
  test('TC-11 six service categories with exact labels', async ({ page }) => {
    await page.goto('/');

    const cards = page.getByTestId('category-card');
    await expect(cards).toHaveCount(6);

    const labels = await cards.locator('h3').allTextContents();
    expect(labels).toEqual([
      'Yoga',
      'Meditation',
      'Ayurveda',
      'Panchkarma',
      'Ayurvedic Spa',
      'Natural Wellness',
    ]);
  });

  test('TC-12 featured centres show the required fields', async ({ page }) => {
    await page.goto('/');

    const cards = page.getByTestId('centre-card');
    await expect(cards).toHaveCount(6);

    const first = cards.first();
    await expect(first.locator('.centre-name')).toBeVisible();
    await expect(first.locator('.centre-city')).toBeVisible();
    await expect(first.locator('.chip').first()).toBeVisible();
    await expect(first.locator('.rating')).toBeVisible();
    await expect(first.locator('.price')).toContainText('₹');
    await expect(first.getByText('Demo', { exact: true })).toBeVisible();
  });

  test('TC-13 how it works lists ordered steps', async ({ page }) => {
    await page.goto('/');

    const steps = page.getByTestId('step');
    await expect(steps).toHaveCount(4);

    const titles = await steps.locator('h3').allTextContents();
    expect(titles).toEqual(['Explore', 'Compare', 'Enquire', 'Choose calmly']);
  });

  test('TC-14 reviews render with demo labels', async ({ page }) => {
    await page.goto('/');

    const reviews = page.getByTestId('review-card');
    await expect(reviews).toHaveCount(4);

    const first = reviews.first();
    await expect(first.locator('.stars')).toBeVisible();
    await expect(first.getByText('Demo', { exact: true })).toBeVisible();
  });

  test('TC-15 demo data is disclosed and India context is present', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('demo-note')).toBeVisible();
    await expect(page.getByTestId('demo-note')).toContainText('illustrative');

    const text = await page.locator('body').innerText();
    expect(text).toContain('₹');
    expect(text).toContain('Rishikesh');
    expect(text).not.toMatch(/testimonial[s]? verified/i);
  });
});

test.describe('responsive behaviour', () => {
  for (const viewport of VIEWPORTS) {
    test(`TC-16 no horizontal overflow — ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      const columns = await page
        .getByTestId('category-grid')
        .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
      const expected = viewport.width < 640 ? 1 : viewport.width < 1024 ? 2 : 3;
      expect(columns).toBe(expected);
    });
  }

  test('TC-17 small screens get the lightweight scene', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');

    const scene = page.getByTestId('hero-scene');
    await expect(scene).toHaveAttribute('data-quality', 'low');
    await expect(scene).toHaveAttribute('data-lazy', 'mounted');
  });
});

test.describe('enquiry flow', () => {
  test('TC-18 validation blocks an invalid enquiry', async ({ page }) => {
    await page.goto('/');
    await openEnquiry(page);

    await page.getByTestId('enquiry-submit').click();
    await expect(page.getByTestId('error-name')).toBeVisible();
    await expect(page.getByTestId('error-email')).toBeVisible();
    await expect(page.getByTestId('error-message')).toBeVisible();

    await page.getByTestId('enquiry-name').fill('Ananya Rao');
    await page.getByTestId('enquiry-email').fill('not-an-email');
    await page.getByTestId('enquiry-message').fill('Please share Panchkarma options.');
    await page.getByTestId('enquiry-submit').click();

    await expect(page.getByTestId('error-email')).toContainText('does not look right');
    await expect(page.getByTestId('enquiry-success')).toHaveCount(0);
  });

  test('TC-19 valid enquiry succeeds and duplicate submits are blocked', async ({ page }) => {
    await page.goto('/');
    await openEnquiry(page);
    await fillValidEnquiry(page, 'ananya@example.com');

    await page.getByTestId('enquiry-submit').click();
    await expect(page.getByTestId('enquiry-submit')).toBeDisabled();
    await expect(page.getByTestId('enquiry-success')).toBeVisible({ timeout: 10000 });

    await page.getByTestId('enquiry-close').click();
    await openEnquiry(page);
    await fillValidEnquiry(page, 'ananya@example.com');
    await page.getByTestId('enquiry-submit').click();

    const error = page.getByTestId('enquiry-error');
    await expect(error).toBeVisible();
    await expect(error).toContainText('wait a few seconds');
    await expect(error).not.toContainText('permission');
  });

  test('TC-20 enquiry adapter rejects short input and stays user friendly', async ({ page }) => {
    await page.goto('/');
    await openEnquiry(page);

    await page.getByTestId('enquiry-name').fill('A');
    await page.getByTestId('enquiry-email').fill('a@b.co');
    await page.getByTestId('enquiry-message').fill('hi');
    await page.getByTestId('enquiry-submit').click();

    await expect(page.getByTestId('error-name')).toContainText('at least 2');
    await expect(page.getByTestId('error-message')).toContainText('at least 10');
    await expect(page.getByTestId('enquiry-success')).toHaveCount(0);
  });
});

test.describe('performance and accessibility plumbing', () => {
  test('TC-21 scene mounts lazily and pauses when the tab is hidden', async ({ page }) => {
    await page.goto('/');

    const scene = page.getByTestId('hero-scene');
    await expect(scene).toHaveAttribute('data-lazy', 'mounted');
    await expect(scene).toHaveAttribute('data-paused', 'false');

    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        configurable: true,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await expect(scene).toHaveAttribute('data-paused', 'true');
  });

  test('TC-22 keyboard journey reaches the key controls', async ({ page }) => {
    await page.goto('/');

    const seen = new Set<string>();
    const collect = async () => {
      const id = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return '';
        return el.dataset?.testid ?? el.getAttribute('aria-label') ?? '';
      });
      if (id) seen.add(id);
    };

    for (let i = 0; i < 40; i += 1) {
      await page.keyboard.press('Tab');
      await collect();
    }

    expect(seen.has('cta-explore')).toBe(true);
    expect(seen.has('cta-find-centre')).toBe(true);
    expect(seen.has('carousel-next')).toBe(true);
    expect(seen.has('category-card')).toBe(true);
    expect(seen.has('centre-enquire')).toBe(true);
  });

  test('TC-24 SEO metadata is present', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/WellTogether/);
    expect(await page.getAttribute('html', 'lang')).toBe('en');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /wellness marketplace/i,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
  });
});
