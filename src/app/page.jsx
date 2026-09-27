"use client";

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import useMouseParallax from '@/components/hooks/UseMouseParallax';
import '@/styles/pages/home/main.css';

const NAV_ITEMS = ['About', 'Blog', 'Projects', 'Contact'];

function getCurrentRotation(el) {
	const matrix = window.getComputedStyle(el).transform;
	if (matrix === 'none') return 0;
	const values = matrix.match(/matrix\(([^)]+)\)/);
	if (!values) return 0;
	const [a, b] = values[1].split(', ').map(Number);
	return Math.round(Math.atan2(b, a) * (180 / Math.PI));
}

export default function Home() {
	const containerRef = useRef(null);
	const bgLayerRef = useRef(null); // darkest diagonal band (parallax far layer)
	const stripeRef = useRef(null); // cream nav stripe (parallax mid layer)
	const valentinaRef = useRef(null);
	const bannerRef = useRef(null);
	const navListRef = useRef(null);
	const grungeARef = useRef(null);
	const grungeBRef = useRef(null);

	useMouseParallax([
		{ ref: bgLayerRef, depth: 28 },
		{ ref: stripeRef, depth: 16 },
		{ ref: valentinaRef, depth: 10 },
		{ ref: bannerRef, depth: 10 },
	]);

	useLayoutEffect(() => {
		let ctx;

		// The intro measures real layout (getBoundingClientRect) to figure
		// out where to start the animation from. If "Ape Out" is still
		// loading when that measurement happens, the browser is rendering
		// with a fallback font, the metrics are wrong, and everything
		// visibly snaps into a different spot the instant the real font
		// swaps in mid-animation — that's the "funky"/"pieces aren't in
		// the right place" jank. Wait for fonts before doing anything.
		const start = () => {
		ctx = gsap.context(() => {
		const reduceMotion = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches;

		const navLinks = navListRef.current.querySelectorAll('.landing__nav-link');

		// Endless slow crossfade between the two grunge texture layers —
		// gives the illusion of the texture subtly shifting/breathing.
		gsap.to(grungeARef.current, {
			opacity: 0,
			duration: 4,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut',
		});
		gsap.fromTo(
			grungeBRef.current,
			{ opacity: 0 },
			{
			opacity: 1,
			duration: 4,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut',
			}
		);

		if (reduceMotion) return;

		// Hide the reveal pieces before we measure/animate anything
		gsap.set([stripeRef.current, bgLayerRef.current], {
			scaleX: 0,
			transformOrigin: 'left center',
		});
		gsap.set(navLinks, { autoAlpha: 0, y: 16 });

		// Measure the natural (final, CSS-driven) position of the two
		// name groups (each is the h1/p wrapper — it carries the
		// triangles as children, so animating it moves the text AND
		// its triangle backdrop together as one rigid piece) so we can
		// compute where "combined + centered + unrotated" would sit,
		// then jump them there before the reveal.
		const nameRotation = getCurrentRotation(valentinaRef.current);
		const vRect = valentinaRef.current.getBoundingClientRect();
		const bRect = bannerRef.current.getBoundingClientRect();
		const gap = 24;
		const combinedWidth = vRect.width + bRect.width + gap;
		const viewportCenterX = window.innerWidth / 2;
		const viewportCenterY = window.innerHeight / 2;

		const targetVLeft = viewportCenterX - combinedWidth / 2;
		const targetVTop = viewportCenterY - vRect.height / 2;
		const targetBLeft = targetVLeft + vRect.width + gap;
		const targetBTop = viewportCenterY - bRect.height / 2;

		const vDX = targetVLeft - vRect.left;
		const vDY = targetVTop - vRect.top;
		const bDX = targetBLeft - bRect.left;
		const bDY = targetBTop - bRect.top;

		gsap.set(valentinaRef.current, { x: vDX, y: vDY, rotation: 0, scale: 1 });
		gsap.set(bannerRef.current, { x: bDX, y: bDY, rotation: 0, scale: 1 });

		const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, delay: 0.2 });

		tl.to([valentinaRef.current, bannerRef.current], {
			x: 0,
			y: 0,
			rotation: nameRotation,
			duration: 1.3,
		})
			.to(
			[bgLayerRef.current, stripeRef.current],
			{ scaleX: 1, duration: 1, ease: 'power4.out' },
			'-=0.9'
			)
			.to(
			navLinks,
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.6,
				stagger: 0.08,
				ease: 'power2.out',
			},
			'-=0.4'
			);
		}, containerRef);
		};

		if (document.fonts && document.fonts.ready) {
			document.fonts.ready.then(start);
		} else {
			start();
		}

		return () => ctx && ctx.revert();
	}, []);

	// Playful per-letter hover punch for each nav word.
	const handleNavEnter = (e) => {
		const letters = e.currentTarget.querySelectorAll('.landing__letter');
		gsap.to(letters, {
		y: -6,
		rotation: () => gsap.utils.random(-6, 6),
		color: 'var(--color-cream)',
		duration: 0.25,
		stagger: 0.02,
		ease: 'back.out(3)',
		});
		gsap.to(e.currentTarget.querySelector('.landing__nav-swipe'), {
		scaleX: 1,
		duration: 0.3,
		ease: 'power2.out',
		});
	};

	const handleNavLeave = (e) => {
		const letters = e.currentTarget.querySelectorAll('.landing__letter');
		gsap.to(letters, {
		y: 0,
		rotation: 0,
		color: 'var(--color-ink)',
		duration: 0.3,
		stagger: 0.015,
		ease: 'power2.inOut',
		});
		gsap.to(e.currentTarget.querySelector('.landing__nav-swipe'), {
		scaleX: 0,
		duration: 0.25,
		ease: 'power2.inOut',
		});
	};

	return (
		<main className="landing" ref={containerRef}>
		<div className="landing__grunge landing__grunge--a" ref={grungeARef} />
		<div className="landing__grunge landing__grunge--b" ref={grungeBRef} />

		<div className="landing__band landing__band--dark" ref={bgLayerRef} />

		<nav className="landing__stripe" ref={stripeRef}>
			<ul className="landing__nav-list" ref={navListRef}>
			{NAV_ITEMS.map((label) => (
				<li key={label} className="landing__nav-item">
				<a
					href={`/${label.toLowerCase()}`}
					className="landing__nav-link"
					onMouseEnter={handleNavEnter}
					onMouseLeave={handleNavLeave}
				>
					<span className="landing__nav-swipe" aria-hidden="true" />
					{label.split('').map((char, i) => (
					<span className="landing__letter" key={`${char}-${i}`}>
						{char}
					</span>
					))}
				</a>
				</li>
			))}
			</ul>
		</nav>

		<h1 className="landing__mark landing__mark--first" ref={valentinaRef}>
			<span className="landing__triangle landing__triangle--dark" aria-hidden="true" />
			<span className="landing__triangle landing__triangle--light" aria-hidden="true" />
			<span className="landing__name">Valentina</span>
		</h1>
		<p className="landing__mark landing__mark--last" ref={bannerRef}>
			<span className="landing__triangle landing__triangle--dark" aria-hidden="true" />
			<span className="landing__triangle landing__triangle--light" aria-hidden="true" />
			<span className="landing__name">Banner</span>
		</p>
		</main>
	);
}
