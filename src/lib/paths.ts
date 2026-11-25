/**
 * The site can be served from a sub-path (GitHub Pages demo:
 * /Nu-Glaze-website-demo/) or from a domain root (nu-glaze.co.za).
 * Links in the pages are written root-relative ("/products/"); the build
 * prefixes them (see astro.config.mjs). These helpers cover the few places
 * that compare or compose paths in code.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** "/Nu-Glaze-website-demo/about/" → "/about/" */
export const stripBase = (p: string) => (base && p.startsWith(`${base}/`) ? p.slice(base.length) : p);

/** "/about/" → "/Nu-Glaze-website-demo/about/" */
export const withBase = (p: string) => `${base}${p}`;
