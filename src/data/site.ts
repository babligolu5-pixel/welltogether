export type ServiceIcon =
  | 'lotus'
  | 'wave'
  | 'leaf'
  | 'drop'
  | 'stone'
  | 'sun';

export interface Service {
  slug: string;
  name: string;
  blurb: string;
  icon: ServiceIcon;
}

export interface Centre {
  id: string;
  name: string;
  city: string;
  services: string[];
  rating: number;
  reviewCount: number;
  priceFrom: number;
  note: string;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  text: string;
  service: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface MenuCategory {
  slug: string;
  label: string;
  service: string;
  intro: string;
  icon: ServiceIcon;
}

/** Landing "Explore Services" grid and the header "Services" menu. */
export const MENU_CATEGORIES: MenuCategory[] = [
  {
    slug: 'yoga',
    label: 'Yoga',
    service: 'Yoga',
    intro: 'Hatha, Iyengar and restorative classes across India.',
    icon: 'lotus',
  },
  {
    slug: 'meditation',
    label: 'Meditation',
    service: 'Meditation',
    intro: 'Guided sits, breathwork and multi-day silence retreats.',
    icon: 'wave',
  },
  {
    slug: 'ayurveda',
    label: 'Ayurveda',
    service: 'Ayurveda',
    intro: 'Physician consultations and daily routines rooted in tradition.',
    icon: 'leaf',
  },
  {
    slug: 'panchkarma',
    label: 'Panchkarma',
    service: 'Panchkarma',
    intro: 'Supervised detox programmes with qualified practitioners.',
    icon: 'drop',
  },
  {
    slug: 'spa',
    label: 'Spa',
    service: 'Ayurvedic Spa',
    intro: 'Abhyanga, shirodhara and warm-oil therapies.',
    icon: 'stone',
  },
];

export const SERVICES: Service[] = [
  {
    slug: 'yoga',
    name: 'Yoga',
    blurb: 'Hatha, Iyengar and restorative sessions for every level of practice.',
    icon: 'lotus',
  },
  {
    slug: 'meditation',
    name: 'Meditation',
    blurb: 'Guided stillness, breathwork and mindfulness retreats.',
    icon: 'wave',
  },
  {
    slug: 'ayurveda',
    name: 'Ayurveda',
    blurb: 'Consultations and daily routines rooted in traditional wisdom.',
    icon: 'leaf',
  },
  {
    slug: 'panchkarma',
    name: 'Panchkarma',
    blurb: 'Supervised detox programmes with qualified practitioners.',
    icon: 'drop',
  },
  {
    slug: 'ayurvedic-spa',
    name: 'Ayurvedic Spa',
    blurb: 'Abhyanga, shirodhara and warm-oil therapies for deep rest.',
    icon: 'stone',
  },
  {
    slug: 'natural-wellness',
    name: 'Natural Wellness',
    blurb: 'Naturopathy, forest bathing and slow seasonal retreats.',
    icon: 'sun',
  },
];

export const CENTRES: Centre[] = [
  {
    id: 'sattva-house',
    name: 'Sattva House',
    city: 'Rishikesh',
    services: ['Yoga', 'Meditation'],
    rating: 4.8,
    reviewCount: 126,
    priceFrom: 1800,
    note: 'Riverside shala with sunrise hatha and silent evenings.',
  },
  {
    id: 'amrita-ayurveda',
    name: 'Amrita Ayurveda Kendra',
    city: 'Kochi',
    services: ['Ayurveda', 'Panchkarma'],
    rating: 4.7,
    reviewCount: 94,
    priceFrom: 2400,
    note: 'Family-run clinic with physician-led Panchkarma programmes.',
  },
  {
    id: 'niraa-spa',
    name: 'Niraa Ayurvedic Spa',
    city: 'Pune',
    services: ['Ayurvedic Spa', 'Natural Wellness'],
    rating: 4.6,
    reviewCount: 71,
    priceFrom: 2100,
    note: 'Warm-oil therapies and a quiet courtyard in the city.',
  },
  {
    id: 'antar-maun',
    name: 'Antar Maun Retreat',
    city: 'Dharamshala',
    services: ['Meditation', 'Yoga'],
    rating: 4.9,
    reviewCount: 58,
    priceFrom: 2600,
    note: 'Five-day silence retreats in the pine hills.',
  },
  {
    id: 'punarnava',
    name: 'Punarnava Wellness',
    city: 'Jaipur',
    services: ['Ayurveda', 'Ayurvedic Spa', 'Yoga'],
    rating: 4.5,
    reviewCount: 83,
    priceFrom: 1600,
    note: 'Herbal consultations and gentle morning movement.',
  },
  {
    id: 'vanam',
    name: 'Vanam Nature Stay',
    city: 'Wayanad',
    services: ['Natural Wellness', 'Panchkarma'],
    rating: 4.7,
    reviewCount: 66,
    priceFrom: 2900,
    note: 'Forest walks, mud therapy and seasonal detox menus.',
  },
  {
    id: 'sukha-sadhana',
    name: 'Sukha Sadhana',
    city: 'Bengaluru',
    services: ['Yoga', 'Meditation', 'Ayurvedic Spa'],
    rating: 4.6,
    reviewCount: 112,
    priceFrom: 1900,
    note: 'City studio with early morning flows and weekend silence sits.',
  },
  {
    id: 'arogya-dhama',
    name: 'Arogya Dhama',
    city: 'Nagpur',
    services: ['Ayurveda', 'Panchkarma'],
    rating: 4.4,
    reviewCount: 47,
    priceFrom: 1700,
    note: 'Physician consultations and short supervised detox stays.',
  },
  {
    id: 'prithvi-wellness',
    name: 'Prithvi Wellness',
    city: 'Udaipur',
    services: ['Ayurvedic Spa', 'Natural Wellness', 'Meditation'],
    rating: 4.8,
    reviewCount: 76,
    priceFrom: 2500,
    note: 'Lakeside therapies, sound baths and slow evening walks.',
  },
  {
    id: 'nirvritti-centre',
    name: 'Nirvritti Centre',
    city: 'Goa',
    services: ['Meditation', 'Yoga'],
    rating: 4.5,
    reviewCount: 63,
    priceFrom: 2200,
    note: 'Breathwork and gentle yoga a short walk from the shore.',
  },
  {
    id: 'shuddhi-panchkarma',
    name: 'Shuddhi Panchkarma',
    city: 'Ahmedabad',
    services: ['Panchkarma', 'Ayurveda'],
    rating: 4.7,
    reviewCount: 88,
    priceFrom: 2000,
    note: 'Traditional detox protocols with daily physician rounds.',
  },
  {
    id: 'aranya-retreat',
    name: 'Aranya Retreat',
    city: 'Coorg',
    services: ['Natural Wellness', 'Yoga'],
    rating: 4.9,
    reviewCount: 54,
    priceFrom: 3100,
    note: 'Plantation walks, forest bathing and restorative practice.',
  },
];

export const STEPS: Step[] = [
  {
    title: 'Find a centre',
    body: 'Browse by service or city and shortlist the centres that fit your needs.',
  },
  {
    title: 'Compare profiles',
    body: 'Check services, ratings, starting prices and what each programme includes.',
  },
  {
    title: 'Send an enquiry',
    body: 'One short message goes straight to the centre — no account, no payment.',
  },
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Ananya R.',
    city: 'Bengaluru',
    rating: 5,
    text: 'I found a Panchkarma programme that matched my schedule in ten minutes. The enquiry was answered the same evening.',
    service: 'Panchkarma',
  },
  {
    id: 'r2',
    author: 'Rohit M.',
    city: 'Delhi',
    rating: 4,
    text: 'Comparing three yoga centres on one page was the part I liked most. No pushy calls afterwards.',
    service: 'Yoga',
  },
  {
    id: 'r3',
    author: 'Meera S.',
    city: 'Pune',
    rating: 5,
    text: 'The descriptions are honest about what a session includes. I booked a spa day feeling informed, not sold to.',
    service: 'Ayurvedic Spa',
  },
  {
    id: 'r4',
    author: 'Kabir T.',
    city: 'Kochi',
    rating: 4,
    text: 'A quiet, calm site that respects your attention. The silence retreat listing was exactly as described.',
    service: 'Meditation',
  },
];

export const HERO_SLIDES = [
  {
    title: 'Yoga & movement',
    body: 'Hatha, Iyengar and restorative classes across 40+ cities.',
  },
  {
    title: 'Ayurveda & Panchkarma',
    body: 'Physician-led programmes with clear inclusions and pricing.',
  },
  {
    title: 'Meditation & silence',
    body: 'Guided sits, breathwork and multi-day retreats.',
  },
  {
    title: 'Natural wellness',
    body: 'Naturopathy, forest bathing and seasonal detox stays.',
  },
];
