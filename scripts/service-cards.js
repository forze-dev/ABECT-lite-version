function initServiceCards() {
	if (window.innerWidth < 1024) {
		return;
	}

	const cards = document.querySelectorAll('.service-card');

	cards.forEach(card => {
		let isAnimating = false;

		card.addEventListener('mouseenter', () => {
			isAnimating = true;
			card.style.transition = 'transform 0.1s cubic-bezier(0.23, 1, 0.320, 1)';
		});

		card.addEventListener('mousemove', (e) => {
			if (!isAnimating) return;

			requestAnimationFrame(() => {
				const rect = card.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				const centerX = rect.width / 2;
				const centerY = rect.height / 2;

				const rotateX = (y - centerY) / centerY * -2.1;
				const rotateY = (x - centerX) / centerX * 2.1;

				const maxRotation = 4.2;
				const clampedRotateX = Math.max(-maxRotation, Math.min(maxRotation, rotateX));
				const clampedRotateY = Math.max(-maxRotation, Math.min(maxRotation, rotateY));

				card.style.transform = `
					perspective(1000px) 
					rotateX(${clampedRotateX}deg) 
					rotateY(${clampedRotateY}deg) 
					translateZ(7px)
					scale3d(1.007, 1.007, 1.007)
				`;
			});
		});

		card.addEventListener('mouseleave', () => {
			isAnimating = false;
			card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)';
			card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
		});
	});
}

export default initServiceCards;