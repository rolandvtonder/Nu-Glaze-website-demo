/**
 * Business facts shared by every page: contact details, navigation, the
 * product range. Copy that belongs to one page lives in that page.
 * Sources: nu-glaze.co.za (2026) and the Nu-Glaze 2026 product range sheet.
 */

export const site = {
  name: 'Nu-Glaze',
  legal: 'Nu-Glaze®',
  tagline: 'uPVC alternative to window putty',
  url: 'https://nu-glaze.co.za',
  owner: 'Johan Otto',
  email: 'johan@nu-glaze.co.za',
  phones: [
    {label: 'RSA & exports', display: '073 866 2300', tel: '+27738662300'},
    {label: 'KwaZulu-Natal', display: '083 456 0131', tel: '+27834560131'},
  ],
  whatsapp: 'https://wa.me/27738662300',
  hours: 'Mon–Fri, 08:00–17:00',
  hoursSchema: 'Mo-Fr 08:00-17:00',
  locality: 'Vredenburg',
  region: 'Western Cape',
  country: 'ZA',
  facebook: 'https://www.facebook.com/nu.glaze.pvc.alternative.to.putty',
  founded: '2007',
  // PDFs are still hosted on the current WordPress site. Move them into
  // public/downloads/ and update these paths before the old site is retired.
  docs: {
    tds: 'https://nu-glaze.co.za/wp-content/uploads/2026/11/Nu-Glaze-TDS-2026.pdf',
    range: 'https://nu-glaze.co.za/wp-content/uploads/2026/11/Product-range-2026.pdf',
    warranty: 'https://nu-glaze.co.za/wp-content/uploads/2025/12/WARRANTY_RGB.pdf',
    pollsmoor: 'https://nu-glaze.co.za/wp-content/uploads/2026/02/Pollsmoor.pdf',
  },
};

export type NavItem = {href: string; label: string; children?: {href: string; label: string}[]};

export const nav: NavItem[] = [
  {href: '/', label: 'Home'},
  {href: '/about/', label: 'About'},
  {href: '/why-nu-glaze/', label: 'Why Nu-Glaze'},
  {href: '/products/', label: 'Products'},
  {
    href: '/installation/',
    label: 'Installation',
    children: [
      {href: '/installation/mitering/', label: 'Mitering & cutting'},
      {href: '/installation/ordering-glass/', label: 'Ordering glass'},
      {href: '/installation/glass-breaks/', label: 'If the glass breaks'},
      {href: '/installation/handling-storage/', label: 'Handling & storage'},
    ],
  },
  {href: '/projects/', label: 'Projects'},
  {href: '/reach-and-teach/', label: 'Reach & Teach'},
  {href: '/contact/', label: 'Contact'},
];

export const secondaryNav = [
  {href: '/certification/', label: 'Certification'},
  {href: '/warranty/', label: 'Warranty'},
  {href: '/faq/', label: 'Tips & FAQ'},
  {href: '/downloads/', label: 'Downloads'},
  {href: '/privacy/', label: 'Privacy (POPIA)'},
];

export type Profile = {
  code: string;
  colour: 'White' | 'Black' | 'Dove grey';
  glass: string;
  toe: string;
  rebate: string;
};

/** The eight profiles in the 2026 range, grouped by series below. */
export const profiles: Profile[] = [
  {code: 'SW4', colour: 'White', glass: '3–4 mm', toe: '10–13 mm', rebate: '18–25 mm'},
  {code: 'SBL4', colour: 'Black', glass: '3–4 mm', toe: '10–13 mm', rebate: '18–25 mm'},
  {code: 'SG4', colour: 'Dove grey', glass: '3–4 mm', toe: '10–13 mm', rebate: '18–25 mm'},
  {code: 'SW7', colour: 'White', glass: '5–6.38 mm', toe: '10–13 mm', rebate: '18–25 mm'},
  {code: 'SBL7', colour: 'Black', glass: '5–6.38 mm', toe: '10–13 mm', rebate: '18–25 mm'},
  {code: 'SG7', colour: 'Dove grey', glass: '5–6.38 mm', toe: '10–13 mm', rebate: '18–25 mm'},
  {code: 'WW4', colour: 'White', glass: '3–4 mm', toe: '6–8 mm', rebate: '12–14 mm'},
  {code: 'WBL4', colour: 'Black', glass: '3–4 mm', toe: '6–8 mm', rebate: '12–14 mm'},
];

export const series = [
  {
    id: 's4',
    name: ['S4', 'series'],
    title: 'Standard rebates, 3–4 mm glass',
    blurb: 'The everyday profile for steel, timber and concrete frames with standard rebates.',
    specs: [
      ['Glass', '3–4 mm'],
      ['Toe height', '10–13 mm'],
      ['Rebate depth', '18–25 mm'],
      ['Colours', 'White · Black · Dove grey'],
    ],
    tint: '#1e2a32',
  },
  {
    id: 's7',
    name: ['S7', 'series'],
    title: 'Thicker & safety glass, 5–6.38 mm',
    blurb: 'For laminated and safety glass. A score line lets you snap it down for low toe heights.',
    specs: [
      ['Glass', '5–6.38 mm'],
      ['Toe height', '10–13 mm'],
      ['Rebate depth', '18–25 mm'],
      ['Colours', 'White · Black · Dove grey'],
    ],
    tint: '#a1110d',
  },
  {
    id: 'w4',
    name: ['W4', 'series'],
    title: 'Small rebates, 3–4 mm glass',
    blurb: 'A slimmer profile for shallow rebates on older timber and light steel sections.',
    specs: [
      ['Glass', '3–4 mm'],
      ['Toe height', '6–8 mm'],
      ['Rebate depth', '12–14 mm'],
      ['Colours', 'White · Black'],
    ],
    tint: '#0a7a3d',
  },
] as const;

export const accessories = [
  {code: 'MSX', name: 'Mitre Shears-Xpert (MSX-1)', use: 'Cuts any profile at any angle, cleanly and without burrs.'},
  {code: 'NG600C', name: 'Nu-Glaze600 neutral-cure silicone, clear, 280 ml', use: 'Adhesion and sealing. Low modulus, construction strength. About 12 linear metres of glazing per cartridge.'},
  {code: 'NG Si/Acr', name: 'Siliconized acrylic, 260 ml (white, black, grey)', use: 'Finishing and sealing hairline gaps. Water-based and paintable when dry. About 50 linear metres per cartridge.'},
  {code: 'SpacerW20', name: 'Spacers, pack of 20 (3 × 12 × 35 mm white ABS)', use: 'Packing out F4B hollow steel windows, or any spacing job.'},
  {code: 'SU100W', name: 'U-clips for steel, white, pack of 100', use: 'For steel frames.'},
];

export const stats = [
  {n: '2012', l: 'In the field, with no deterioration recorded since'},
  {n: 'A3', l: 'SANS 613 rating — domestic minimum is A1'},
  {n: '8+', l: 'Countries with Nu-Glaze installations'},
  {n: '100+', l: 'Installers trained through Reach & Teach'},
];
