// Модальное окно
const modal = document.getElementById('contactModal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
let lastActiveElement = null;

function showModal() {
    lastActiveElement = document.activeElement;
    modal.hidden = false;
    modal.querySelector('input, select, textarea, button')?.focus();
}

function hideModal() {
    modal.hidden = true;
    lastActiveElement?.focus();
}

openModalBtn?.addEventListener('click', showModal);
closeModalBtn?.addEventListener('click', hideModal);

// Закрытие модалки по клику на подложку
modal?.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal__backdrop')) {
        hideModal();
    }
});

// Закрытие модалки по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
        hideModal();
    }
});

// Валидация формы
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', (e) => {
    // 1) Сброс кастомных сообщений
    [...contactForm.elements].forEach(el => {
        if (el.setCustomValidity) {
            el.setCustomValidity('');
        }
    });

    // 2) Проверка встроенных ограничений
    if (!contactForm.checkValidity()) {
        e.preventDefault();

        // Кастомные сообщения об ошибках
        const email = contactForm.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }

        const phone = contactForm.elements.phone;
        if (phone?.validity.patternMismatch) {
            phone.setCustomValidity('Введите телефон в формате +7 (900) 000-00-00');
        }

        contactForm.reportValidity();

        // Подсветка проблемных полей
        [...contactForm.elements].forEach(el => {
            if (el.willValidate) {
                el.toggleAttribute('aria-invalid', !el.checkValidity());
            }
        });
        return;
    }

    // 3) Успешная «отправка» (без сервера)
    e.preventDefault();
    alert('Форма успешно отправлена!');
    contactForm.reset();
    hideModal();
});

// Маска для телефона (дополнительное задание)
const phoneInput = document.getElementById('phone');
phoneInput?.addEventListener('input', (e) => {
    const input = e.target;
    let numbers = input.value.replace(/\D/g, '');
    
    if (numbers.startsWith('8')) {
        numbers = '7' + numbers.slice(1);
    }
    
    numbers = numbers.slice(0, 11);
    
    if (numbers.length === 0) {
        input.value = '';
        return;
    }
    
    let formattedValue = '+7';
    
    if (numbers.length > 1) {
        formattedValue += ` (${numbers.slice(1, 4)}`;
    }
    
    if (numbers.length >= 5) {
        formattedValue += `) ${numbers.slice(4, 7)}`;
    }
    
    if (numbers.length >= 8) {
        formattedValue += `-${numbers.slice(7, 9)}`;
    }
    
    if (numbers.length >= 10) {
        formattedValue += `-${numbers.slice(9, 11)}`;
    }
    
    input.value = formattedValue;
});

// Валидация телефона при потере фокуса
phoneInput?.addEventListener('blur', () => {
    const pattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (phoneInput.value && !pattern.test(phoneInput.value)) {
        phoneInput.setCustomValidity('Введите телефон в формате +7 (900) 000-00-00');
        phoneInput.setAttribute('aria-invalid', 'true');
    } else {
        phoneInput.setCustomValidity('');
        phoneInput.removeAttribute('aria-invalid');
    }
});

// Переключатель темы
const themeToggle = document.querySelector('.theme-toggle');
const THEME_KEY = 'theme';

function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    // Автовыбор: сохранённая тема или системная
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('theme-dark');
        themeToggle?.setAttribute('aria-pressed', 'true');
    } else {
        document.body.classList.remove('theme-dark');
        themeToggle?.setAttribute('aria-pressed', 'false');
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('theme-dark');
    const newTheme = isDark ? 'dark' : 'light';
    
    themeToggle?.setAttribute('aria-pressed', String(isDark));
    localStorage.setItem(THEME_KEY, newTheme);
    
    // Обновляем иконку
    const icon = themeToggle?.querySelector('.theme-toggle__icon use');
    if (icon) {
        icon.setAttribute('href', isDark ? '#moon-icon' : '#sun-icon');
    }
}

// Инициализация темы при загрузке
document.addEventListener('DOMContentLoaded', initTheme);

// Обработчик клика по переключателю
themeToggle?.addEventListener('click', toggleTheme);

// Слушаем изменения системной темы
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
        document.body.classList.toggle('theme-dark', e.matches);
        themeToggle?.setAttribute('aria-pressed', String(e.matches));
    }
});

