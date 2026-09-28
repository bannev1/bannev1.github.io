'use client';
import { useEffect, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee, { Lattice } from '@/components/Marquee';
import Work from '@/components/Work';
import About from '@/components/About';
import Contact from '@/components/Contact';
import { ticker } from '@/data/content';

export default function Home() {
  const [ready, setReady] = useState(false);

  // Web fonts change text size once loaded; re-measure so scroll animations fire in the right place.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Marquee items={ticker} />
        <Work />
        <Lattice />
        <About />
        <Marquee items={ticker} tone="blue" reverse />
        <Contact />
      </main>
    </>
  );
}
