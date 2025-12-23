var darkTheme = false;

setParticles();

$(window).on('load',() => {
	if (window.matchMedia) {
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			darkmode(true);
			setParticles('./assets/js/particles/dark-particles.json');
		}

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
			darkmode(event.matches ? true : false);
		});
	}

	var ipAddress = 'Unable to track...';
	var userLocation = 'Unable to track...';

	getUserIP().then(ip => {
		ipAddress = ip;

		getUserLocation(ip).then(location => {
			userLocation = location;
		});	
	});	

	checkNavScroll();

	$('#loader').fadeOut('fast');

	checkProjectSize();

	var element = document.getElementsByClassName('typewrite')[0];
	var toRotate = element.getAttribute('data-type');
	var period = element.getAttribute('data-period');
	if (toRotate) {
		new TxtType(element, JSON.parse(toRotate), period);
	}

	$('#nav-hamburger').on('click tap',() => {
		$('#hamburger-inner').toggleClass('hamburger-clicked');
		$('#hamburger-items').toggleClass('hamburger-showing');

		if ($('#hamburger-items').css('display') == 'none') {
			$('body').css({'overflow': 'hidden'});
			$('#nav-hamburger').css({'height': '100%'});
			$('#hamburger-items').css({'display': 'flex'});
		} else {
			$('body').css({'overflow': 'scroll'});
			setTimeout(() => {
				$('#hamburger-items').css({'display': 'none'})
				$('#nav-hamburger').css({'height': 'fit-content'});
				checkNavScroll();
			}, 500);
		}
	})

	$('a[href^="#"]').on('click tap',(event) => {
		event.preventDefault();
		scrollToElem($( $(event.target).attr('href') ));
	});

	$('.title').on('click tap',(event) => {
		scrollToElem($(event.target).parent());
	})

	$("#contact-form").on("submit", function() {
		$.ajax({
			url: "https://formspree.io/f/xojaybdn", 
			method: "POST",
			dataType: "json",
			data: {
				email: $('#email').val(),
				name: $('#name').val(),
				message: $('#message').val(),
				ip: ipAddress,
				location: userLocation
			},
			complete: () => {
				$('#email').val('')
				$('#name').val('')
				$('#message').val('')
			},
			success: () => {
				if (!(darkTheme)) {
					Swal.fire({title: "Success!",
							   text: "Message Sent!",
							   icon: 'success'});
				} else {
					Swal.fire({title: "Success!",
							   text: "Message Sent!",
							   icon: 'success',
							   background: '#303030',
							   color: 'white'});
				}
			},
			error: () => {
				if (!(darkTheme)) {
					Swal.fire({title: "Oops...",
							   text: "Message Failed to Send",
							   icon: 'error'});
				} else {
					Swal.fire({title: "Oops...",
							   text: "Message Failed to Send",
							   icon: 'error',
							   background: '#303030',
							   color: 'white'});
				}
			},
		});
	});

	$('#toTop').on('click tap', () => {
		$('html, body').animate({ scrollTop: 0 }, 500);
	})

	$('.scroll-indicator').on('click tap', () => {
		scrollToElem($('#about'));
	})

	const swiper = new Swiper('.swiper', {
		loop: true,
		slidesPerView: 'auto',
		centeredSlides: true,
		spaceBetween: 75,
		variableWidth : true,
		watchSlidesProgress: true,
		rewind: true,
		keyboard: {
			enabled: true,
		},
		autoplay: {
			delay: 3500,
			disableOnInteraction: true,
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});

	$(() => {
		$.scrollify({
			section: '.scrollSect',
			updateHash: false,
			scrollSpeed: 1000,
			setHeights: false,
			touchScroll: false,
			offset: 0
		})
	})

	$('.darkmode').on('click tap', () => {darkmode()})

	$(window).on('resize', () => {
		checkProjectSize();
	})

	$(window).on('scroll', () => {
		checkNavScroll();
	})

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
			} else {
				entry.target.classList.remove('visible');
			}
		});
	});

	const hiddenElements = document.querySelectorAll('.hidden');
	hiddenElements.forEach(element => {
			observer.observe(element);
		}
	);
})

async function getUserIP() {
	try {
		const response = await fetch('https://ipapi.co/json/');
		const data = await response.json();
		return data.ip;
	} catch (error) {
		console.error(error);
		return 'Unable to track...';
	}
}

async function getUserLocation(ip) {
	if (ip == 'Unable to track...') {
		return ip;
	}

	try {
		const response = await fetch(`https://ipapi.co/${ip}/json/`);
		const data = await response.json();
		return JSON.stringify(data);
	} catch (error) {
		console.error(error);
		return 'Unable to track...';
	}
}

function checkNavScroll() {
	const navbar = $('#navbar');
	const navY = $('#navY');

	if ($(window).scrollTop() >= navY.offset().top) {
		if ($('#hamburger-items').css('display') == 'none') {
			navbar.css({"position": "fixed","top": "0px"});
			navY.css({"height": '60px'});
		}
	} else {
		if ($('#hamburger-items').css('display') == 'none') {
			navbar.css({"position": "relative","top": "0px"});
			navY.css({"height": "0px"});
		}
	}
}

function checkProjectSize() {
	const windWidth = $(window).width();
	const swiperSlides = $('.swiper-slide');

	if (windWidth <= 500 && windWidth != swiperSlides) {
		swiperSlides.each((i, obj) => {
			obj.style.setProperty('width', 'calc(100vw - 30px)','important');
		})
	} else {
		swiperSlides.each((i, obj) => {
			obj.style.setProperty('width', '500px','important');
		})
	}
}

var TxtType = function(el, toRotate, period) {
	this.toRotate = toRotate;
	this.el = el;
	this.loopNum = 0;
	this.period = parseInt(period, 10) || 2000;
	this.txt = '';
	this.tick();
	this.isDeleting = false;
};

TxtType.prototype.tick = function() {
	var i = this.loopNum % this.toRotate.length;
	var fullTxt = this.toRotate[i];

	if (this.isDeleting) {
		this.txt = fullTxt.substring(0, this.txt.length - 1);
	} else {
		this.txt = fullTxt.substring(0, this.txt.length + 1);
	}

	this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

	var that = this;
	var delta = 200 - Math.random() * 100;

	if (this.isDeleting) { delta /= 2; }

	if (!this.isDeleting && this.txt === fullTxt) {
		delta = this.period;
		this.isDeleting = true;
	} else if (this.isDeleting && this.txt === '') {
		this.isDeleting = false;
		this.loopNum++;
		delta = 500;
	}

	setTimeout(function() {
		that.tick();
	}, delta);
};

function scrollToElem(elem) {
	if ($(window).width() > 800) {
		$('html, body').animate({
			scrollTop: elem.offset().top - 65
		}, 500);
	} else {
		$('html, body').animate({
			scrollTop: elem.offset().top - 5
		}, 500);
	}
}

function darkmode (theme = 'none') {
	if (theme == 'none') {
		darkTheme = !(!!(darkTheme));
	} else {
		darkTheme = theme;
	}

	const elementChanges = [
		['body', 'bodydark'],
		['.title', 'darktitle'],
		
		['.head-title', 'darkheadtitle'],
		['#navbar', 'darknavbar'],
		['.waves', 'darkwaves'],
		['.scroll-indicator', 'dark-scroll-indicate'],

		['.darkmode', 'darkmodeactive'],
		['.logo', 'dark-logo'],

		['button', 'dark-button'],
		['input[type="button"]', 'dark-button'],
		['input[type="submit"]', 'dark-button'],

		['footer', 'dark-footer'],
		['.social-links', 'dark-social-links'],
		['.about-description', 'darktitle'],

		['.skill-card', 'dark-card'],
		['.skill-title', 'dark-description'],
		['.skill-icon', 'dark-icon'],

		['#projects', 'dark-section'],
		['.project-card', 'dark-card'],
		['.project-title', 'darktitle'],
		['.project-description', 'dark-hyperlink'],
		['.project-github', 'dark-github'],
		['.swiper-button-next, .swiper-button-prev', 'dark-swiper-button'],

		['.contact-card', 'dark-card'],
		['.contact-texts', 'dark-input'],
	]

	elementChanges.forEach(element => {
		$(element[0]).toggleClass(element[1], darkTheme);
	});

	if (darkTheme) {setParticles('./assets/js/particles/dark-particles.json')} else {setParticles()}
}

function setParticles (path = './assets/js/particles/light-particles.json') {
	particlesJS.load('home', path);
}
