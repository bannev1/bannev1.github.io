'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import Split from './Split';
import { projects } from '@/data/content';

export default function Work() {
  const root = useRef();

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.head .ch', { yPercent: 105, stagger: 0.08, duration: 1, scrollTrigger: { trigger: '.head', start: 'top 85%' } });
      gsap.set('.cell', { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch('.cell', {
        start: 'top 90%', once: true,
        onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 1, overwrite: true }),
      });
    });

    // Big background character slides against the pointer inside each card.
    mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
      const off = [];
      gsap.utils.toArray('.card').forEach((card) => {
        const zh = card.querySelector('.card__zh');
        const x = gsap.quickTo(zh, 'x', { duration: 0.6, ease: 'power3' });
        const y = gsap.quickTo(zh, 'y', { duration: 0.6, ease: 'power3' });
        const move = (e) => {
          const r = card.getBoundingClientRect();
          x(((e.clientX - r.left) / r.width - 0.5) * -30);
          y(((e.clientY - r.top) / r.height - 0.5) * -30);
        };
        const leave = () => { x(0); y(0); };
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', leave);
        off.push(() => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); });
      });
      return () => off.forEach((f) => f());
    });
  }, { scope: root });

  return (
    <section id="work" className="section work" ref={root}>
      <div className="head">
        <h2 className="head__zh zh worn"><Split text="作品" /></h2>
        <p className="head__en">Selected work</p>
      </div>
      <ul className="work__grid">
        {projects.map((p) => (
          <li className="cell" key={p.title}>
            <article className={`card card--${p.tone}`}>
              <a href={p.href}>
                <span className="card__zh zh" aria-hidden="true">{p.zh}</span>
                <div>
                  <h3 className="card__title">{p.title}</h3>
                  <p className="card__blurb">{p.blurb}</p>
                </div>
                <div className="card__foot">
                  <ul className="card__tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                  <span className="card__arrow" aria-hidden="true">→</span>
                </div>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
