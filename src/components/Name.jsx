'use client';

import React, { useRef } from 'react'

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

function Name() {
	const firstName = useRef(null);
	const lastName = useRef(null);

	useGSAP(() => {
		gsap.to('*', {
			duration: 1,
			scrambleText: {
				text: "Valentina",
				chars: "XO",
				revealDelay: 0.5,
				speed: 0.3
			}
		})
	}, {scope: firstName})

	useGSAP(() => {
		gsap.to('*', {
			duration: 1,
			scrambleText: {
				text: "Banner",
				chars: "XO",
				revealDelay: 0.5,
				speed: 0.3
			}
		})
	}, {scope: lastName})

	return (
		<div id="name">
			<p>Hello, I'm</p>
			<div>
				<p ref={firstName}>Valentina</p>
				<p ref={lastName}>Banner</p>
			</div>
		</div>
	)
}

export default Name
