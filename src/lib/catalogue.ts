import { CENTRES, MENU_CATEGORIES, type Centre, type MenuCategory } from '../data/site';

/**
 * Data access layer. Pages go through these functions so the static dataset can
 * later be replaced by Firestore reads without touching page components.
 */
export const getCentres = (): Centre[] => CENTRES;

export const getCities = (): string[] =>
  Array.from(new Set(CENTRES.map((centre) => centre.city))).sort((a, b) =>
    a.localeCompare(b),
  );

export const getCentresByService = (service: string): Centre[] =>
  CENTRES.filter((centre) => centre.services.includes(service));

export const getMenuCategories = (): MenuCategory[] => MENU_CATEGORIES;

export const findMenuCategory = (slug: string): MenuCategory | undefined =>
  MENU_CATEGORIES.find((category) => category.slug === slug);
