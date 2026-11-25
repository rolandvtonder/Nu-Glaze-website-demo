import type {ImageMetadata} from 'astro';

/**
 * Project photos from the Nu-Glaze Facebook page, numbered p000–p215 in
 * src/assets/photos (the order they sat in the media folder). Each is sorted
 * into one category for the gallery filter. A few non-glazing jobs (roofing,
 * ceilings) and a third-party shopfront are left out on purpose.
 */

const files = import.meta.glob<{default: ImageMetadata}>('../assets/photos/*.jpg', {eager: true});

export const photo = (n: number): ImageMetadata => {
  const key = `../assets/photos/p${String(n).padStart(3, '0')}.jpg`;
  const mod = files[key];
  if (!mod) throw new Error(`Missing photo ${key}`);
  return mod.default;
};

export type Category = 'steel' | 'timber' | 'homes' | 'before-after' | 'team';

export const categories: {id: Category; label: string; alt: string}[] = [
  {id: 'steel', label: 'Steel windows & doors', alt: 'Steel-framed windows and doors glazed with Nu-Glaze profiles'},
  {id: 'timber', label: 'Timber windows', alt: 'Timber window frames re-glazed with Nu-Glaze instead of putty and beading'},
  {id: 'homes', label: 'Homes & heritage', alt: 'Homes and heritage buildings with windows glazed using Nu-Glaze'},
  {id: 'before-after', label: 'Before & after', alt: 'Before and after: failing putty replaced with Nu-Glaze'},
  {id: 'team', label: 'Installers & training', alt: 'Nu-Glaze installers at work and in training'},
];

const groups: Record<Exclude<Category, 'homes'>, number[]> = {
  'before-after': [11, 12, 13, 14, 15, 34, 43, 56, 58, 60, 66, 68, 69, 76, 77, 99, 101, 112, 125, 131, 133, 137, 140, 144, 146, 176, 208, 209, 215],
  team: [26, 50, 57, 64, 67, 73, 79, 83, 84, 91, 104, 106, 109, 113, 116, 121, 124, 128, 134, 145, 155, 159, 173, 174, 175, 182, 183, 185, 188, 192, 195, 198, 205],
  steel: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 17, 18, 19, 20, 21, 22, 23, 24, 27, 28, 29, 30, 37, 38, 39, 42, 49, 55, 72, 80, 81, 82, 86, 88, 90, 92, 94, 95, 96, 98, 100, 103, 105, 107, 108, 110, 111, 126, 142, 172, 199, 200, 201, 202, 203, 210, 211, 212, 213, 214],
  timber: [35, 41, 47, 51, 53, 54, 63, 123, 177, 178, 179, 180, 181, 184, 186, 187, 189, 190, 191, 193, 194, 204, 206, 207],
};

const excluded = new Set([89, 147, 148, 149, 151, 152, 153]);

export const gallery = Array.from({length: 216}, (_, n) => n)
  .filter((n) => !excluded.has(n))
  .map((n) => {
    const cat = (Object.keys(groups) as (keyof typeof groups)[]).find((k) => groups[k].includes(n)) ?? 'homes';
    const c = categories.find((x) => x.id === cat)!;
    return {n, cat, img: photo(n), alt: `${c.alt} (project photo ${n + 1})`};
  });

/** Hand-picked photos with written descriptions, used across the site. */
export const featured = {
  livingRoom: {img: photo(200), alt: 'Sunlit living room with black steel internal screens and doors glazed with Nu-Glaze'},
  shopfront: {img: photo(212), alt: 'Double-height black steel shopfront and French doors glazed with Nu-Glaze'},
  timberRestored: {img: photo(186), alt: 'Restored timber window with forty panes re-glazed in black Nu-Glaze profiles'},
  heritage: {img: photo(117), alt: 'Two-storey heritage office building with white-framed windows glazed with Nu-Glaze'},
  profiles: {img: photo(175), alt: 'The Nu-Glaze profile range laid out on timber: SW4, SW7, SG4, SG7, SBL4, SBL7, WW4 and WBL4'},
  vsPutty: {img: photo(215), alt: 'Side-by-side window: clean Nu-Glaze bead next to cracked, failing putty'},
  puttyFailing: {img: photo(56), alt: 'Close-up of failing, cracked window putty before replacement'},
  frontal: {img: photo(66), alt: 'Nu-Glaze SW4 frontal installation on a white steel window, glass left in place'},
  installer: {img: photo(67), alt: 'Berney Mahlare, a Nu-Glaze installer, in front of a window he glazed'},
  training: {img: photo(121), alt: 'Group of trained Nu-Glaze installers standing together outside a building'},
  trainingSession: {img: photo(109), alt: 'Trainees gathered around a Nu-Glaze demonstration on site'},
  workshop: {img: photo(183), alt: 'Two installers mitering and fitting Nu-Glaze profiles at a workshop table'},
  heritageColumns: {img: photo(102), alt: 'Heritage building with classical columns and restored steel windows'},
  capeDutch: {img: photo(46), alt: 'Cape Dutch gabled home with green-framed windows glazed with Nu-Glaze'},
  bathroom: {img: photo(19), alt: 'Bathroom with reeded glass in black steel screens glazed with Nu-Glaze'},
  reeded: {img: photo(38), alt: 'Close-up of reeded glass held by a black Nu-Glaze profile'},
  conservatory: {img: photo(9), alt: 'Steel-framed conservatory beside a swimming pool, glazed with Nu-Glaze'},
  timberOld: {img: photo(181), alt: 'Weathered timber casement windows ready for re-glazing'},
  steelCorner: {img: photo(21), alt: 'Corner of a black steel window wall looking out over a garden'},
  waterfront: {img: photo(165), alt: 'Steel window beside the sea, glazed with Nu-Glaze, catching the late sun'},
  mitreDemo: {img: photo(106), alt: 'Applying neutral-cure silicone to a frame before fitting a Nu-Glaze profile'},
  measuring: {img: photo(104), alt: 'Installer measuring a window frame on a tiled floor'},
  steelDoors: {img: photo(201), alt: 'Black steel internal door and screen with frosted glass'},
};
