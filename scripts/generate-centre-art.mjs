import { mkdir, writeFile } from 'node:fs/promises';

const centres = [
  ['sattva-house', 'Sattva House', 'Rishikesh'],
  ['amrita-ayurveda', 'Amrita Ayurveda Kendra', 'Kochi'],
  ['niraa-spa', 'Niraa Ayurvedic Spa', 'Pune'],
  ['antar-maun', 'Antar Maun Retreat', 'Dharamshala'],
  ['punarnava', 'Punarnava Wellness', 'Jaipur'],
  ['vanam', 'Vanam Nature Stay', 'Wayanad'],
  ['sukha-sadhana', 'Sukha Sadhana', 'Bengaluru'],
  ['arogya-dhama', 'Arogya Dhama', 'Nagpur'],
  ['prithvi-wellness', 'Prithvi Wellness', 'Udaipur'],
  ['nirvritti-centre', 'Nirvritti Centre', 'Goa'],
  ['shuddhi-panchkarma', 'Shuddhi Panchkarma', 'Ahmedabad'],
  ['aranya-retreat', 'Aranya Retreat', 'Coorg'],
];

const palettes = [
  ['#e9efdf', '#b7c8a2', '#5f6b45'],
  ['#f3eee4', '#d6c7b3', '#8a7a63'],
  ['#e4ecf1', '#a9c0cd', '#4a6070'],
  ['#f1ece2', '#cdd6bf', '#6d7a55'],
  ['#eef1e6', '#c6d3b8', '#5a6847'],
  ['#e8efe9', '#b3c6bb', '#4f6b5d'],
];

const initials = (name) =>
  name
    .split(' ')
    .filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

const svg = ([id, name, city], index) => {
  const [bg1, bg2, ink] = palettes[index % palettes.length];
  const marks = initials(name);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="${name}, ${city}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${ink}" stop-opacity="0"/>
      <stop offset="1" stop-color="${ink}" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <circle cx="600" cy="150" r="190" fill="#ffffff" opacity="0.28"/>
  <circle cx="600" cy="150" r="250" fill="none" stroke="${ink}" stroke-width="1.5" opacity="0.25"/>
  <circle cx="600" cy="150" r="310" fill="none" stroke="${ink}" stroke-width="1" opacity="0.16"/>
  <path d="M0 470c120-70 220-70 340 0s220 70 340 0 120-40 120-40v170H0Z" fill="${ink}" opacity="0.16"/>
  <path d="M0 520c120-55 220-55 340 0s220 55 340 0 120-30 120-30v110H0Z" fill="${ink}" opacity="0.22"/>
  <text x="56" y="150" font-family="Georgia, 'Times New Roman', serif" font-size="110" fill="${ink}" opacity="0.9">${marks}</text>
  <text x="58" y="196" font-family="Arial, sans-serif" font-size="20" letter-spacing="3" fill="${ink}" opacity="0.7">WELLTOGETHER · DEMO</text>
  <text x="56" y="560" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="${ink}" opacity="0.85">${name}</text>
  <text x="58" y="590" font-family="Arial, sans-serif" font-size="17" fill="${ink}" opacity="0.65">${city}</text>
  <rect x="0" y="0" width="800" height="600" fill="url(#fade)" opacity="0"/>
  <g opacity="0.35">
    <circle cx="120" cy="330" r="6" fill="${ink}"/>
    <circle cx="152" cy="330" r="6" fill="${ink}"/>
    <circle cx="184" cy="330" r="6" fill="${ink}"/>
  </g>
  <title>${name}, ${city}</title>
</svg>
`;
};

await mkdir('public/centres', { recursive: true });
for (const [index, centre] of centres.entries()) {
  await writeFile(`public/centres/${centre[0]}.svg`, svg(centre, index), 'utf8');
}
console.log(`wrote ${centres.length} centre illustrations`);
