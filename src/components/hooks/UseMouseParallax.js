"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Subtle "camera follows the mouse" parallax.
 *
 * Pass an array of { ref, depth } layers — depth is how far that
 * layer travels in px at the edge of the screen. Give background
 * elements a bigger depth than foreground text so they drift more,
 * which is what sells the parallax illusion.
 *
 * Respects prefers-reduced-motion (effect is skipped entirely).
 */
export default function useMouseParallax(layers) {
  const quickSettersRef = useRef([]);

  useEffect(() => {
	const reduceMotion = window.matchMedia(
	  '(prefers-reduced-motion: reduce)'
	).matches;
	if (reduceMotion) return undefined;

	// Build one quickTo tween per axis per layer — much cheaper than
	// gsap.to() on every mousemove event.
	quickSettersRef.current = layers.map(({ ref, depth = 20 }) => ({
	  depth,
	  x: gsap.quickTo(ref.current, 'x', {
		duration: 1.1,
		ease: 'power3.out',
	  }),
	  y: gsap.quickTo(ref.current, 'y', {
		duration: 1.1,
		ease: 'power3.out',
	  }),
	}));

	const handleMove = (e) => {
	  const { innerWidth, innerHeight } = window;
	  // normalize to -1 → 1 from the center of the viewport
	  const nx = (e.clientX / innerWidth - 0.5) * 2;
	  const ny = (e.clientY / innerHeight - 0.5) * 2;

	  quickSettersRef.current.forEach(({ depth, x, y }) => {
		x(nx * depth);
		y(ny * depth * 0.6); // less vertical travel, feels more natural
	  });
	};

	window.addEventListener('mousemove', handleMove, { passive: true });
	return () => window.removeEventListener('mousemove', handleMove);
	// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}