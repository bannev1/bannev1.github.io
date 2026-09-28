'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Split from './Split';
import { profile } from '@/data/content';

const WEEK = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const MONTH = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

export default function Hero({ ready }) {
  const root = useRef();
  const intro = useRef();
  const [now, setNow] = useState(null);

  // The calendar shows today's date; it is set after mount so server and browser never disagree.
  useEffect(() => setNow(new Date()), []);

  // 1) Build the intro paused, so the hidden start state is applied before the first paint (no flash).
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      intro.current = gsap.timeline({ paused: true })
        .from('.hero__big .ch', { yPercent: 105, stagger: 0.1, duration: 1.3 })
        .from('.hero__en .ch', { yPercent: 105, stagger: 0.025, duration: 0.9 }, '-=0.9')
        .from('.hero__meta > *', { autoAlpha: 0, y: 14, stagger: 0.1, duration: 0.9 }, '-=0.7')
        .from('.hero__cal', { autoAlpha: 0, y: -40, rotate: -3, transformOrigin: '50% 0', duration: 1.5 }, '-=1.1')
        .from('.hero__stamp', { autoAlpha: 0, scale: 1.5, duration: 0.7, ease: 'power2.in' }, '-=0.4');

      // The calendar sways gently on its hook.
      gsap.to('.cal__sheet', { rotate: 1.2, transformOrigin: '50% 0', duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });

      // Title drifts up slowly as you scroll away.
      gsap.to('.hero__big', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 } });
      return () => { intro.current = null; };
    });

    // Calendar follows the pointer a little (mouse only).
    mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
      const x = gsap.quickTo('.cal__sheet', 'x', { duration: 1, ease: 'power3' });
      const y = gsap.quickTo('.cal__sheet', 'y', { duration: 1, ease: 'power3' });
      const el = root.current;
      const move = (e) => {
        x((e.clientX / window.innerWidth - 0.5) * 16);
        y((e.clientY / window.innerHeight - 0.5) * 12);
      };
      el.addEventListener('pointermove', move);
      return () => el.removeEventListener('pointermove', move);
    });
  }, { scope: root });

  // 2) Play it when the loader lifts.
  useGSAP(() => { if (ready) intro.current?.play(); }, { dependencies: [ready] });

  return (
    <section id="home" className="hero" ref={root}>
      <div className="hero__top">
        <span>{profile.role}</span>
        <span>Portfolio</span>
      </div>

      <div className="hero__stage">
        <h1 className="hero__title">
          <span className="hero__big zh worn"><Split text="作品集" /></span>
          <span className="hero__en"><Split text={profile.name} /></span>
        </h1>

        <div className="hero__cal" aria-hidden="true">
          <div className="cal__sheet">
            <div className="cal__rings"><i /><i /></div>
            <p className="cal__month zh">{now ? MONTH[now.getMonth()] : '　'}</p>
            <p className="cal__day">{now ? now.getDate() : '--'}</p>
            <p className="cal__week zh">{now ? WEEK[now.getDay()] : '　'}</p>
            <p className="cal__note">Portfolio {now ? now.getFullYear() : ''}</p>
          </div>
        </div>
      </div>

      <div className="hero__meta">
        <p className="hero__ticket">Open for work · 歡迎合作</p>
        <a className="hero__cue" href="#work">向下 Scroll</a>
      </div>
      <span className="hero__stamp zh" aria-hidden="true">原創</span>
    </section>
  );
}
