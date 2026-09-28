'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Split from './Split';
import { profile, socials } from '@/data/content';

export default function Contact() {
  const root = useRef();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%' } })
        .from('.contact__zh .ch', { yPercent: 105, stagger: 0.12, duration: 1.1 })
        .from('.contact__lead, .contact__mail', { autoAlpha: 0, y: 20, stagger: 0.12, duration: 0.9 }, '-=0.6')
        .from('.contact__list li', { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.8 }, '-=0.5');
    });
  }, { scope: root });

  return (
    <section id="contact" className="section contact" ref={root}>
      <h2 className="contact__zh zh worn"><Split text="聯絡我" /></h2>
      <p className="contact__lead">Have a project or an idea? Send a message and I will reply within two days.</p>
      <a className="contact__mail" href={`mailto:${profile.email}`}>{profile.email}</a>
      <ul className="contact__list">
        {socials.map((s) => (
          <li key={s.name}><a href={s.href}><span className="zh">{s.zh}</span><b>{s.name}</b><i aria-hidden="true">↗</i></a></li>
        ))}
      </ul>
      <p className="contact__foot">© 2026 {profile.name}. Designed and built by hand.</p>
    </section>
  );
}
