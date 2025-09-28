import { initBurgerMenu, initActiveNavigation } from './header.js';
import initContactForms from './forms.js';
import initSliders from './sliders.js';
import initWorkCards from './works.js';

document.addEventListener('DOMContentLoaded', () => {
	initBurgerMenu();
	initActiveNavigation();
	initContactForms();
	initWorkCards();
	initSliders();

	const cards = document.querySelectorAll('.service-card');

	cards.forEach(card => {
		let isAnimating = false;

		card.addEventListener('mouseenter', () => {
			isAnimating = true;
			card.style.transition = 'transform 0.1s cubic-bezier(0.23, 1, 0.320, 1)';
		});

		card.addEventListener('mousemove', (e) => {
			if (!isAnimating) return;

			// Використовуємо requestAnimationFrame для плавності
			requestAnimationFrame(() => {
				const rect = card.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				const centerX = rect.width / 2;
				const centerY = rect.height / 2;

				// Зменшуємо інтенсивність нахилу для плавності
				const rotateX = (y - centerY) / centerY * -3;
				const rotateY = (x - centerX) / centerX * 3;

				// Обмежуємо кути для природності
				const maxRotation = 6;
				const clampedRotateX = Math.max(-maxRotation, Math.min(maxRotation, rotateX));
				const clampedRotateY = Math.max(-maxRotation, Math.min(maxRotation, rotateY));

				card.style.transform = `
                            perspective(1000px) 
                            rotateX(${clampedRotateX}deg) 
                            rotateY(${clampedRotateY}deg) 
                            translateZ(10px)
                            scale3d(1.01, 1.01, 1.01)
                        `;
			});
		});

		card.addEventListener('mouseleave', () => {
			isAnimating = false;
			card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)';
			card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
		});
	});
});