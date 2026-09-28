'use client';
import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Split from './Split';

// Opening moment: title rises, a rule fills, then the page lifts away as the hero begins.
export default function Loader({ onDone }) {
  const root = useRef();
  const [gone, setGone] = useState(false);

  useGSAP(() => {
    const num = root.current.querySelector('.loader__num');
    const n = { v: 0 };
    document.body.style.overflow = 'hidden';
    gsap.set('.loader__frame', { autoAlpha: 1 }); // CSS keeps it hidden until JS is ready, so nothing flashes

    gsap.timeline({ onComplete: () => { document.body.style.overflow = ''; setGone(true); } })
      .from('.loader__zh .ch', { yPercent: 105, stagger: 0.08, duration: 0.9 })
      .from('.loader__rule', { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, ease: 'power2.inOut' }, 0.2)
      .to(n, { v: 100, duration: 1.2, ease: 'power2.inOut', onUpdate: () => { num.textContent = String(Math.round(n.v)).padStart(2, '0'); } }, 0.2)
      .addLabel('exit', '+=0.25')
      .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 'exit')
      .call(() => onDone?.(), null, 'exit+=0.45'); // hero intro starts while the loader is still lifting
  }, { scope: root });

  if (gone) return null;
  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__frame">
        <h2 className="loader__zh zh"><Split text="作品集" /></h2>
        <div className="loader__meter"><span className="loader__rule" /></div>
        <p className="loader__num">00</p>
      </div>
    </div>
  );
}
