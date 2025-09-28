function initContactForms() {
	const forms = document.querySelectorAll('[data-form="form"]');

	const openModalButtons = document.querySelectorAll('#open-modal, [id="open-modal"]');

	openModalButtons.forEach(button => {
		button.addEventListener('click', function (e) {
			e.preventDefault();

			// Тимчасово відключаємо smooth scroll
			const html = document.documentElement;
			const originalScrollBehavior = html.style.scrollBehavior;
			html.style.scrollBehavior = 'auto';
			html.style.scrollPaddingTop = '110px';

			// Переходимо до секції контактів
			const contactsSection = document.getElementById('contacts');
			if (contactsSection) {
				contactsSection.scrollIntoView();

				// Фокусуємося на першому полі форми для кращого UX
				const firstInput = contactsSection.querySelector('input[name="username"]');
				if (firstInput) {
					setTimeout(() => {
						firstInput.focus();
					}, 100);
				}
			}

			// Повертаємо smooth scroll через невеликий проміжок часу
			setTimeout(() => {
				html.style.scrollBehavior = originalScrollBehavior;
			}, 50);
		});
	});

	forms.forEach(form => {
		let isFocused = false;

		const phoneInput = form.querySelector('input[name="phone"]');
		const fileInput = form.querySelector('.file-input');
		const fileUploadBtn = form.querySelector('.file-upload-btn');

		// Ініціалізація телефонного поля
		initPhoneInput(phoneInput, isFocused);

		// Ініціалізація файлового поля
		if (fileInput && fileUploadBtn) {
			initFileInput(fileInput, fileUploadBtn, form);
		}

		// Обробка відправки форми
		form.addEventListener("submit", (event) => {
			handleFormSubmit(event, form, () => {
				isFocused = false;
			});
		});
	});

	// Ініціалізація телефонного поля
	function initPhoneInput(phoneInput, isFocused) {
		phoneInput.addEventListener("focus", function () {
			if (!isFocused) {
				phoneInput.value = "+38 (";
				isFocused = true;
			}
		});

		phoneInput.addEventListener("input", (event) => {
			formatPhoneNumber(event, phoneInput);
		});

		phoneInput.addEventListener("keydown", (event) => {
			preventPhoneDelete(event, phoneInput);
		});
	}

	// Ініціалізація файлового поля
	function initFileInput(fileInput, fileUploadBtn, form) {
		// Клік по кнопці відкриває файловий діалог
		fileUploadBtn.addEventListener('click', () => {
			fileInput.click();
		});

		// Обробка вибору файлу
		fileInput.addEventListener('change', (event) => {
			handleFileSelect(event, form);
		});
	}

	// Обробка вибору файлу
	function handleFileSelect(event, form) {
		const fileInput = event.target;
		const filePreview = form.querySelector('.file-preview');
		const uploadBtn = form.querySelector('.file-upload-btn');
		const fileName = filePreview.querySelector('.file-name');
		const fileSize = filePreview.querySelector('.file-size');
		const removeBtn = filePreview.querySelector('.file-remove');
		const file = fileInput.files[0];

		if (file) {
			// Валідація розміру файлу (максимум 20MB)
			if (file.size > 20 * 1024 * 1024) {
				showMessage(form, 'validation', 'Файл занадто великий! Максимум 20MB');
				fileInput.value = '';
				return;
			}

			// Валідація типу файлу
			const allowedTypes = [
				'application/pdf',
				'image/jpeg',
				'image/jpg',
				'image/png',
				'application/msword',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			];

			if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.dwg')) {
				showMessage(form, 'validation', 'Неприпустимий тип файлу! Дозволені: PDF, JPG, PNG, DOC, DOCX, DWG');
				fileInput.value = '';
				return;
			}

			// Показати інформацію про файл
			fileName.innerHTML = `<img src="/assets/icons/attached-file.svg" alt="Іконка скріпки" width="18" height="18"> ${file.name}`;
			fileSize.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;

			// Переключити видимість елементів
			uploadBtn.classList.add('hidden');
			filePreview.classList.add('show');

			// Обробник видалення файлу
			removeBtn.onclick = function () {
				fileInput.value = '';
				uploadBtn.classList.remove('hidden');
				filePreview.classList.remove('show');
			};
		}
	}

	// Обробка відправки форми
	async function handleFormSubmit(event, form, resetCallback) {
		event.preventDefault();

		const phoneInput = form.querySelector('input[name="phone"]');
		const nameInput = form.querySelector('input[name="username"]');
		const commentInput = form.querySelector('textarea[name="comment"]');
		const fileInput = form.querySelector('.file-input');
		const submitBtn = form.querySelector('button[type="submit"]')
		const prevText = submitBtn.innerText

		// Валідація полів
		if (!nameInput.value.trim()) {
			showMessage(form, 'validation', 'Будь ласка, введіть ваше ім\'я!');
			nameInput.focus();
			return;
		}

		if (phoneInput.value.length < 18) {
			showMessage(form, 'validation', 'Будь ласка, введіть повний номер телефону!');
			phoneInput.focus();
			return;
		}

		submitBtn.textContent = "Надсилання..."

		// Підготовка даних для відправки
		const formData = new FormData();
		formData.append('username', nameInput.value.trim());
		formData.append('phone', phoneInput.value);
		formData.append('comment', commentInput.value.trim() || 'Коментар не залишено');

		if (fileInput.files[0]) {
			formData.append('drawing', fileInput.files[0]);
		}

		// Відправка форми
		try {
			const response = await fetch('/scripts/form.php', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const timestamp = Date.now();
				window.location.href = `/thank-you.html?formStatus=sended&timestamp=${timestamp}`;
			} else {
				showMessage(form, 'error', 'Помилка відправки форми. Спробуйте ще раз або зателефонуйте нам.');
			}
		} catch (error) {
			showMessage(form, 'error', 'Помилка з\'єднання з сервером. Перевірте інтернет-з\'єднання та спробуйте ще раз.');
		} finally {
			submitBtn.textContent = prevText
			resetCallback()
		}
	}

	// Показати повідомлення
	function showMessage(form, type, message) {
		const messageElement = form.querySelector(`.form-${type}`);

		if (messageElement) {
			messageElement.textContent = message;
			messageElement.style.display = 'block';

			// Автоматично приховати через 5 секунд
			setTimeout(() => {
				messageElement.style.display = 'none';
			}, 5000);
		}
	}

	// Форматування номера телефону
	function formatPhoneNumber(event, phoneInput) {
		let value = phoneInput.value.replace(/\D/g, "");

		// Видалити код країни якщо він є
		if (value.startsWith("38")) {
			value = value.slice(2);
		}

		// Обмежити до 10 цифр
		if (value.length > 10) {
			value = value.substring(0, 10);
		}

		// Форматування
		let formatted = "+38 (";
		if (value.length > 0) formatted += value.substring(0, 3);
		if (value.length > 3) formatted += ") " + value.substring(3, 7);
		if (value.length > 7) formatted += " " + value.substring(7, 10);

		phoneInput.value = formatted;
	}

	// Запобігання видаленню базової частини номера
	function preventPhoneDelete(event, phoneInput) {
		if ((event.key === "Backspace" || event.key === "Delete") && phoneInput.value.length <= 5) {
			event.preventDefault();
		}
	}
}

export default initContactForms;
