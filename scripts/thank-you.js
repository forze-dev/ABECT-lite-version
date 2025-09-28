// function checkThankYouParams() {
// 	// Отримуємо параметри з URL
// 	const urlParams = new URLSearchParams(window.location.search);

// 	// Перевіряємо наявність обов'язкових параметрів
// 	const formStatus = urlParams.get('formStatus');
// 	const timestamp = urlParams.get('timestamp');

// 	// Якщо параметрів немає або вони некоректні - перенаправляємо на головну
// 	if (!formStatus || formStatus !== 'sended' || !timestamp) {
// 		window.location.href = '/';
// 		return false;
// 	}

// 	// Додаткова перевірка timestamp (не старше 10 хвилин)
// 	const currentTime = Date.now();
// 	const paramTimestamp = parseInt(timestamp);
// 	const timeDifference = currentTime - paramTimestamp;
// 	const tenMinutes = 10 * 60 * 1000; // 10 хвилин в мілісекундах

// 	// Якщо timestamp некоректний або занадто старий
// 	if (isNaN(paramTimestamp) || timeDifference > tenMinutes) {
// 		window.location.href = '/';
// 		return false;
// 	}

// 	// Якщо все ок - показуємо сторінку подяки
// 	console.log('Thank you page accessed successfully');
// 	return true;
// }

// // Запускаємо перевірку при завантаженні сторінки
// document.addEventListener('DOMContentLoaded', checkThankYouParams);