# Nu-Glaze website

A multi-page marketing site for Nu-Glaze®, the patented uPVC alternative to window putty. Built with Astro (static HTML), Tailwind CSS v4 and Lenis smooth scrolling.

## Run it

```powershell
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
npm run check     # type-check every page
```

`dist/` is plain static files: it can be hosted on Netlify, Vercel, Cloudflare Pages or any cPanel host (upload the contents of `dist/` to `public_html`).

## Pages

| URL | Page |
| --- | --- |
| `/` | Home: hero slideshow, S4/S7/W4 series panels, putty problem, benefits, methods, projects, security, training, FAQ |
| `/about/` | Story, timeline, reach |
| `/why-nu-glaze/` | Nu-Glaze vs putty & beading, comparison table, security case studies |
| `/products/` | All 8 profiles, full range table, tools & consumables |
| `/installation/` | Full & frontal installation guide (+ 4 sub-guides) |
| `/projects/` | Filterable gallery of 209 job photos with lightbox |
| `/reach-and-teach/` | Installer training programme |
| `/certification/`, `/warranty/`, `/faq/`, `/downloads/`, `/contact/`, `/privacy/` | Info pages |

## Where things live

- `src/data/site.ts` — phone numbers, email, address, navigation, the product range, PDF links. Change contact details here once and every page updates.
- `src/data/gallery.ts` — which photo is in which gallery category, and the hand-picked photos (with alt text) used on pages.
- `src/assets/photos/` — the job photos (`p000.jpg`–`p215.jpg`, copied from `media/`). Astro converts them to AVIF/WebP at several sizes on build.
- `src/scripts/site.ts` — the single animation loop: smooth scroll, hero blur-out, menu wipe and ripple, reveals, panel slide-in, gallery and contact form.
- `src/styles/global.css` — brand colours, fonts and shared styles (`@theme` block).

## SEO built in

- Unique title, description and canonical URL on every page; Open Graph and Twitter cards with a branded share image (`public/og-image.jpg`).
- JSON-LD structured data: `HomeAndConstructionBusiness` + `WebSite` sitewide, `BreadcrumbList` on inner pages, plus `ItemList` of `Product`s, `FAQPage`, `HowTo`, `Course`, `ImageGallery` and `ContactPage` where relevant.
- `sitemap-index.xml` (auto-generated) and `robots.txt`.
- Static HTML, responsive AVIF/WebP images with descriptive alt text, one `h1` per page.

## Before going live

1. **PDFs** — the data sheet, product range, warranty and Pollsmoor PDFs still link to the old WordPress site (`site.docs` in `src/data/site.ts`). Copy them into `public/downloads/` and update the paths, or they'll break when the old site is switched off.
2. **Claims** — the old site gave conflicting figures (lifespan "indefinite" vs "25+ years" vs "minimum 5-year" warranty; founded 2007 vs patent from 1998). This site uses the conservative, verifiable ones. Confirm with the owner.
3. **Contact form** — it opens the visitor's email or WhatsApp with the message filled in, so no server is needed. If a form that sends directly is wanted, connect a form service (e.g. Netlify Forms).
4. **Logo** — the only logo file available is a 382 px PNG. A vector (SVG) version would look sharper.
5. **Google Business Profile & Search Console** — submit `https://nu-glaze.co.za/sitemap-index.xml` after launch.
