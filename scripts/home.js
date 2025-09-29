import { initBurgerMenu, initActiveNavigation } from './header.js';
import initContactForms from './forms.js';
import initSliders from './sliders.js';
import initWorkCards from './works.js';
import initServiceCards from './service-cards.js';

document.addEventListener('DOMContentLoaded', () => {
	initBurgerMenu();
	initActiveNavigation();
	initContactForms();
	initWorkCards();
	initSliders();
	initServiceCards()
});