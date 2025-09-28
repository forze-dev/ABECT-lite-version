function initBurgerMenu() {
	const burgerBtn = document.querySelector(".header__burger");
	const headerNav = document.querySelector(".header__menu");
	const body = document.querySelector("body");

	burgerBtn.addEventListener("click", toggleBurgersClasses);
	headerNav.addEventListener("click", (event) => {
		let clickedLink = event.target.closest("a");

		if (clickedLink) {
			closeMenu();
		}
	});

	// Змінні для виявлення свайпу
	let touchStartX = 0;
	let touchEndX = 0;
	let touchStartY = 0;
	let touchEndY = 0;
	let isSwiping = false;

	// Відстеження початку дотику
	headerNav.addEventListener("touchstart", (event) => {
		touchStartX = event.changedTouches[0].screenX;
		touchStartY = event.changedTouches[0].screenY;
		isSwiping = false;
	});

	// Відстеження руху дотику - визначаємо, що це свайп
	headerNav.addEventListener("touchmove", (event) => {
		isSwiping = true;
		touchEndX = event.changedTouches[0].screenX;
		touchEndY = event.changedTouches[0].screenY;
	});

	// Обробка закінчення дотику
	headerNav.addEventListener("touchend", (event) => {
		// Перевіряємо, чи був рух (свайп), а не просто клік
		if (isSwiping) {
			handleSwipeGesture();
		}
		// Скидаємо прапор свайпу
		isSwiping = false;
	});

	function handleSwipeGesture() {
		const horizontalDistance = touchStartX - touchEndX;
		const verticalDistance = Math.abs(touchStartY - touchEndY);

		if (horizontalDistance > 70 && horizontalDistance > verticalDistance) {
			console.log("Свайп виявлено, закриваємо меню");
			closeMenu();
		}
	}

	function toggleBurgersClasses() {
		burgerBtn.classList.toggle("active");
		headerNav.classList.toggle("active");
		body.classList.toggle("fixed-body");
	}

	function closeMenu() {
		burgerBtn.classList.remove("active");
		headerNav.classList.remove("active");
		body.classList.remove("fixed-body");
	}
}

function initActiveNavigation() {
	const sections = document.querySelectorAll('section[id]');
	const navLinks = document.querySelectorAll('.header__menu-nav a[data-section]');
	const indicator = document.querySelector('.nav-indicator');
	const header = document.querySelector('header');

	// Setup Intersection Observer
	function setupIntersectionObserver() {
		const options = {
			root: null,
			rootMargin: '-20% 0px -70% 0px',
			threshold: 0
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					updateIndicator(entry.target.id);
				}
			});
		}, options);

		sections.forEach(section => {
			observer.observe(section);
		});
	}

	// Update indicator position
	function updateIndicator(activeSection) {
		const activeLink = document.querySelector(`[data-section="${activeSection}"]`);
		if (!activeLink) return;

		const linkRect = activeLink.getBoundingClientRect();
		const navRect = activeLink.closest('.header__menu-nav').getBoundingClientRect();

		const leftPosition = linkRect.left - navRect.left;
		const width = linkRect.width;

		indicator.style.left = `${leftPosition}px`;
		indicator.style.width = `${width}px`;
		indicator.classList.add('active');

		// Update active state for links
		navLinks.forEach(link => {
			link.classList.remove('active');
		});
		activeLink.classList.add('active');
	}

	// Setup smooth scroll
	function setupSmoothScroll() {
		navLinks.forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const targetId = link.getAttribute('data-section');
				const targetSection = document.getElementById(targetId);

				if (targetSection) {
					const headerHeight = header.offsetHeight;
					const targetPosition = targetSection.offsetTop - headerHeight - 50;

					window.scrollTo({
						top: targetPosition,
						behavior: 'smooth'
					});
				}
			});
		});
	}

	// Setup scroll effect
	function setupScrollEffect() {
		let isScrolled = false;

		window.addEventListener('scroll', () => {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

			if (scrollTop > 50 && !isScrolled) {
				header.classList.add('scrolled');
				isScrolled = true;
			} else if (scrollTop <= 50 && isScrolled) {
				header.classList.remove('scrolled');
				isScrolled = false;
			}
		});
	}

	// Initialize everything
	setupIntersectionObserver();
	setupSmoothScroll();
	setupScrollEffect();

	// Initialize indicator position
	updateIndicator('services');
}

export { initBurgerMenu, initActiveNavigation };