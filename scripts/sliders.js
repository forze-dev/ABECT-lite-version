function initSliders() {
	var swiper = new Swiper(".gallery__swipper", {
		effect: "slide", // Змінюємо з coverflow на slide
		grabCursor: true,
		centeredSlides: true,
		slidesPerView: "auto",
		spaceBetween: 10,
		loop: true, // Безкінечний слайдер
		initialSlide: 2, // Починаємо з 3-го слайда (індекс 2)

		// Налаштування відображення слайдів
		breakpoints: {
			// Мобільні пристрої
			320: {
				slidesPerView: 1.4, // 0.2 - 1 - 0.2
				spaceBetween: 15,
			},
			// Планшети та десктоп
			768: {
				slidesPerView: 3.6, // 0.3 - 1 - 1 - 1 - 0.3
				spaceBetween: 20,
			}
		},

		pagination: {
			el: ".swiper-pagination",
			clickable: true,
			type: "bullets",
			dynamicBullets: true
		},
	});
}

export default initSliders;