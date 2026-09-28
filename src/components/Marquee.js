'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

// Slow ticker. Scrolling nudges its speed and direction; the speed is eased every frame so it never jerks.
export default function Marquee({ items, tone = 'red', reverse = false }) {
  const root = useRef();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tween = gsap.fromTo('.marquee__track',
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: 45, ease: 'none', repeat: -1 });

      let target = 1;
      let current = 1;
      const st = ScrollTrigger.create({
        onUpdate: (s) => { target = s.direction * (1 + Math.min(Math.abs(s.getVelocity()) / 1500, 1.5)); },
      });
      const tick = () => {
        target += (1 - target) * 0.04;      // settle back to a calm forward drift
        current += (target - current) * 0.08; // smooth the change
        tween.timeScale(current);
      };
      gsap.ticker.add(tick);
      return () => { gsap.ticker.remove(tick); st.kill(); };
    });
  }, { scope: root });

  const group = (k) => (
    <div className="marquee__group" key={k} aria-hidden={k > 0}>
      {[...items, ...items].map((t, i) => <span key={i} className="zh">{t}<b>◆</b></span>)}
    </div>
  );

  return (
    <div className={`marquee marquee--${tone}`} ref={root} role="presentation">
      <div className="marquee__track">{[0, 1].map(group)}</div>
    </div>
  );
}

// Window-lattice band. It drifts with a transform (GPU-friendly), not by repainting the background.
export function Lattice() {
  const inner = useRef();
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(inner.current, { x: 0 }, { x: -160, duration: 18, ease: 'none', repeat: -1 }); // 160px = 4 whole tiles
    });
  }, { scope: inner });
  return (
    <div className="lattice" aria-hidden="true">
      <div className="lattice__inner" ref={inner} />
    </div>
  );
}
