import Lenis from 'lenis';

/**
 * One rAF loop for the whole site. Lenis advances first, then each
 * scroll-driven piece reads its own rect and writes styles directly, so
 * scrolling never touches layout-thrashing work beyond one read per piece.
 */

type Tick = (time: number) => void;
const subscribers = new Set<Tick>();
const onFrame = (fn: Tick) => subscribers.add(fn);
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis: Lenis | null = null;

function startScroll() {
  if (!reduced) lenis = new Lenis({lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9});
  const loop = (time: number) => {
    lenis?.raf(time);
    subscribers.forEach((fn) => fn(time));
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  // In-page anchors glide through Lenis instead of jumping.
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || !lenis) return;
    const id = a.getAttribute('href')!;
    const target = id === '#top' ? 0 : document.querySelector<HTMLElement>(id);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target, {duration: 1.4, offset: -80});
  });
}

/* ── Hero: crossfading photos; the stage blurs, dims and pulls back as you
   scroll away, which reads as the camera retreating rather than a fade. ── */
function hero() {
  const root = document.querySelector<HTMLElement>('[data-hero]');
  const stage = root?.querySelector<HTMLElement>('[data-stage]');
  if (!root || !stage) return;

  const slides = [...root.querySelectorAll<HTMLElement>('.slide')];
  if (slides.length > 1 && !reduced) {
    let i = 0;
    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);
    window.setInterval(() => {
      if (!visible || document.hidden) return;
      slides[i].classList.remove('is-on');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-on');
    }, 6000);
  }

  if (reduced) return;
  onFrame(() => {
    const r = root.getBoundingClientRect();
    const h = window.innerHeight;
    const p = clamp(-r.top / h);
    if (p >= 1 && stage.dataset.done) return;
    stage.dataset.done = p >= 1 ? '1' : '';
    // A blurred full-screen layer is expensive to keep; drop it once it has
    // scrolled away so it doesn't compete with the images below for GPU memory.
    stage.style.visibility = p >= 1 ? 'hidden' : '';
    stage.style.transform = `translate3d(0, ${(p * h * 0.45).toFixed(1)}px, 0) scale(${(1 - p * 0.08).toFixed(4)})`;
    stage.style.filter = p > 0.01 ? `blur(${(p * 16).toFixed(1)}px) brightness(${(1 - p * 0.5).toFixed(3)})` : 'none';
  });
}

/* ── Menu: three slabs wipe in (ink, glass, paper); hovering an item runs it
   through a turbulence + displacement filter — the ripple of old, uneven
   window glass. ── */
function menu() {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
  const panel = document.querySelector<HTMLElement>('[data-menu]');
  if (!btn || !panel) return;
  const label = btn.querySelector<HTMLElement>('[data-menu-label]')!;
  const turb = panel.querySelector('feTurbulence');
  const disp = panel.querySelector('feDisplacementMap');
  const links = [...panel.querySelectorAll<HTMLAnchorElement>('[data-menu-item]')];
  let open = false;

  const set = (v: boolean) => {
    open = v;
    panel.dataset.open = v ? 'true' : 'false';
    panel.inert = !v;
    btn.setAttribute('aria-expanded', String(v));
    label.textContent = v ? 'Close' : 'Menu';
    document.documentElement.dataset.menuOpen = v ? 'true' : 'false';
    if (v) {
      lenis?.stop();
      window.setTimeout(() => links[0]?.focus({preventScroll: true}), 450);
    } else {
      lenis?.start();
    }
  };
  set(false);
  btn.addEventListener('click', () => set(!open));
  panel.querySelector('[data-menu-close]')?.addEventListener('click', () => set(false));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      set(false);
      btn.focus();
    }
  });

  let raf = 0;
  const ripple = (on: boolean) => {
    cancelAnimationFrame(raf);
    if (!on || reduced) {
      disp?.setAttribute('scale', '0');
      return;
    }
    let t = 0;
    let amp = 0;
    const loop = () => {
      t += 0.016;
      amp = Math.min(1, amp + 0.08);
      turb?.setAttribute('baseFrequency', `${(0.012 + Math.sin(t * 2.1) * 0.004).toFixed(4)} ${(0.06 + Math.cos(t * 1.7) * 0.02).toFixed(4)}`);
      turb?.setAttribute('seed', String(Math.floor(t * 12) % 50));
      disp?.setAttribute('scale', (amp * 8).toFixed(2));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  };
  const list = panel.querySelector('[data-menu-list]');
  links.forEach((a) => {
    const enter = () => {
      list?.setAttribute('data-hover', 'true');
      links.forEach((l) => l.classList.toggle('is-hot', l === a));
      ripple(true);
    };
    a.addEventListener('mouseenter', enter);
    a.addEventListener('focus', enter);
  });
  list?.addEventListener('mouseleave', () => {
    list.removeAttribute('data-hover');
    links.forEach((l) => l.classList.remove('is-hot'));
    ripple(false);
  });
}

/* ── Reveals: [data-reveal] gets .is-in the first time it is seen. ── */
function reveals() {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        // Elements already scrolled past (a jump link, a reload mid-page)
        // count as seen, so nothing above the viewport stays hidden.
        if (!e.isIntersecting && e.boundingClientRect.top > 0) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }),
    {rootMargin: '0px 0px -8% 0px'},
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}

/* ── Series panels: slide in from the right one after another, each showing
   its own third of one photograph. ── */
function panels() {
  document.querySelectorAll<HTMLElement>('[data-panels]').forEach((el) => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.shown = 'true';
        io.disconnect();
      },
      {threshold: 0.2},
    );
    io.observe(el);
  });
}

/* ── Fit text: a single line sized to span its parent exactly, measured
   rather than guessed in vw; re-fits once the web font arrives. ── */
function fitText() {
  document.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
    const parent = el.parentElement!;
    const fit = () => {
      el.style.fontSize = '100px';
      const s = getComputedStyle(parent);
      const avail = parent.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
      const natural = el.offsetWidth;
      if (natural > 0) el.style.fontSize = `${(100 * avail) / natural}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    new ResizeObserver(fit).observe(parent);
  });
}

/* ── Gallery: category filter and a keyboard-friendly lightbox. ── */
function gallery() {
  const root = document.querySelector<HTMLElement>('[data-gallery]');
  if (!root) return;
  const items = [...root.querySelectorAll<HTMLElement>('[data-cat]')];
  const filters = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const count = document.querySelector<HTMLElement>('[data-count]');

  filters.forEach((b) =>
    b.addEventListener('click', () => {
      const f = b.dataset.filter!;
      filters.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      let n = 0;
      items.forEach((it) => {
        const show = f === 'all' || it.dataset.cat === f;
        it.hidden = !show;
        if (show) n++;
      });
      if (count) count.textContent = `${n} photos`;
      lenis?.resize();
    }),
  );

  const box = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  if (!box) return;
  const img = box.querySelector('img')!;
  const cap = box.querySelector<HTMLElement>('[data-cap]')!;
  let idx = 0;
  const visible = () => items.filter((it) => !it.hidden);
  const show = (i: number) => {
    const list = visible();
    idx = (i + list.length) % list.length;
    const a = list[idx].querySelector('a')!;
    img.src = a.href;
    img.alt = a.querySelector('img')!.alt;
    cap.textContent = `${idx + 1} / ${list.length} — ${img.alt}`;
  };
  items.forEach((it) =>
    it.querySelector('a')!.addEventListener('click', (e) => {
      e.preventDefault();
      show(visible().indexOf(it));
      box.showModal();
      lenis?.stop();
    }),
  );
  box.addEventListener('close', () => lenis?.start());
  box.querySelector('[data-prev]')!.addEventListener('click', () => show(idx - 1));
  box.querySelector('[data-next]')!.addEventListener('click', () => show(idx + 1));
  box.querySelector('[data-close]')!.addEventListener('click', () => box.close());
  box.addEventListener('click', (e) => e.target === box && box.close());
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
}

/* ── Contact form: no server needed — it composes an email or a WhatsApp
   message from the fields, so nothing is stored anywhere. ── */
function contactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const d = new FormData(form);
    const via = (e.submitter as HTMLButtonElement | null)?.value ?? 'email';
    const body = [
      `Name: ${d.get('name')}`,
      `Phone: ${d.get('phone')}`,
      `Email: ${d.get('email')}`,
      `Location: ${d.get('location')}`,
      `Frame type: ${d.get('frame')}`,
      `Approx. number of panes: ${d.get('panes') || '—'}`,
      '',
      String(d.get('message') || ''),
    ].join('\n');
    const subject = `Quote request — ${d.get('frame')} windows, ${d.get('location')}`;
    const url =
      via === 'whatsapp'
        ? `${form.dataset.whatsapp}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`
        : `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent =
      via === 'whatsapp'
        ? 'Opening WhatsApp with your message ready to send…'
        : 'Opening your email app with your message ready to send…';
    window.open(url, via === 'whatsapp' ? '_blank' : '_self');
  });
}

/* ── Header: once you scroll past the hero, the logo plate and menu button
   switch to their solid variants so they stay legible over light pages. ── */
function header() {
  const h = document.documentElement;
  if (h.dataset.solid) return;
  onFrame(() => {
    const scrolled = (lenis ? lenis.scroll : window.scrollY) > 40;
    if ((h.dataset.scrolled === 'true') !== scrolled) h.dataset.scrolled = String(scrolled);
  });
}

startScroll();
hero();
menu();
reveals();
panels();
fitText();
gallery();
contactForm();
header();
