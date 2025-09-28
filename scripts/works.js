function initWorkCards() {
	if (window.innerWidth <= 768) {
		const showMoreBtn = document.getElementById('showMoreWorks');
		const hiddenCards = document.querySelectorAll('.works__card.hidden-mobile');

		showMoreBtn?.addEventListener('click', function () {
			hiddenCards.forEach(card => card.classList.add('show'));
			this.parentElement.classList.add('hidden');
		});
	}
}

export default initWorkCards