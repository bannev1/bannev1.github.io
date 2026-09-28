'use client';
import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { links } from '@/data/content';

export default function Nav() {
  const root = useRef();
  const [open, setOpen] = useState(false);
  const first = useRef(true);

  // Scroll progress line along the bottom of the bar.
  useGSAP(() => {
    gsap.to('.nav__bar', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  }, { scope: root });

  // Full-screen menu on small screens.
  useGSAP(() => {
    if (first.current) { first.current = false; return; } // don't animate on first render
    gsap.to('.menu', { clipPath: open ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'power4.inOut' });
    if (open) gsap.from('.menu a', { yPercent: 40, autoAlpha: 0, stagger: 0.08, delay: 0.25, duration: 0.7 });
  }, { scope: root, dependencies: [open] });

  const toggle = (v) => {
    setOpen(v);
    document.body.style.overflow = v ? 'hidden' : '';
  };

  return (
    <header className="nav" ref={root}>
      <div className="nav__row">
        <a className="nav__logo zh" href="#home" onClick={() => toggle(false)}>作品集</a>
        <nav className="nav__links" aria-label="Main">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`}><b className="zh">{l.zh}</b><span>{l.en}</span></a>
          ))}
        </nav>
        <button className="nav__burger" aria-expanded={open} aria-controls="menu" onClick={() => toggle(!open)}>
          {open ? '關閉 Close' : '選單 Menu'}
        </button>
      </div>
      <div className="nav__bar" />
      <nav id="menu" className={`menu ${open ? 'is-open' : ''}`} aria-label="Mobile">
        {links.map((l) => (
          <a key={l.id} href={`#${l.id}`} className="zh" onClick={() => toggle(false)}>
            {l.zh}<small>{l.en}</small>
          </a>
        ))}
      </nav>
    </header>
  );
}
