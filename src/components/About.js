'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Split from './Split';
import { profile, almanac, skills } from '@/data/content';

export default function About() {
  const root = useRef();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.head .ch', { yPercent: 105, stagger: 0.08, duration: 1, scrollTrigger: { trigger: '.head', start: 'top 85%' } });

      gsap.from('.almanac__cell', { autoAlpha: 0, y: 28, stagger: 0.14, duration: 1, scrollTrigger: { trigger: '.almanac', start: 'top 78%' } });

      gsap.utils.toArray('[data-count]').forEach((el) => {
        const o = { v: 0 };
        el.textContent = '0';
        gsap.to(o, {
          v: +el.dataset.count, duration: 1.8, ease: 'power2.out', snap: { v: 1 },
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate: () => { el.textContent = o.v; },
        });
      });

      gsap.from('.skills__col', { autoAlpha: 0, y: 24, stagger: 0.12, duration: 1, scrollTrigger: { trigger: '.skills', start: 'top 88%' } });
    });
  }, { scope: root });

  return (
    <section id="about" className="section about" ref={root}>
      <div className="head">
        <h2 className="head__zh zh worn"><Split text="關於" /></h2>
        <p className="head__en">About me</p>
      </div>

      <div className="almanac">
        <div className="almanac__head"><span className="zh">個人簡介</span><span>{profile.name}</span></div>
        <div className="almanac__grid">
          <div className="almanac__cell almanac__cell--yi">
            <h3 className="zh">宜</h3>
            <ul>{almanac.yi.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="almanac__cell almanac__cell--bio">
            {profile.bio.map((p) => <p key={p}>{p}</p>)}
            <dl className="stats">
              {almanac.stats.map((s) => (
                <div key={s.l}><dt data-count={s.n}>{s.n}</dt><dd>{s.l}</dd></div>
              ))}
            </dl>
          </div>
          <div className="almanac__cell almanac__cell--ji">
            <h3 className="zh">忌</h3>
            <ul>{almanac.ji.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
      </div>

      <div className="skills">
        {skills.map((g) => (
          <div className="skills__col" key={g.group}>
            <h3 className="zh">{g.group}</h3>
            <ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}
