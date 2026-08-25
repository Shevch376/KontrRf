const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.nav-dropdown-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const dropdown = button.closest('.nav-dropdown');
    const isOpen = dropdown.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const modals = {
  callback: document.querySelector('#callback-modal'),
  document: document.querySelector('#document-modal'),
  job: document.querySelector('#job-modal')
};

let lastFocusedElement = null;

function openModal(modal) {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modal.querySelector('input, button, a')?.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  lastFocusedElement?.focus();
}

document.querySelectorAll('[data-open-modal]').forEach((button) => {
  button.addEventListener('click', () => openModal(modals[button.dataset.openModal]));
});

document.querySelectorAll('[data-close-modal]').forEach((button) => {
  button.addEventListener('click', () => closeModal(button.closest('.modal')));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal(document.querySelector('.modal:not([hidden])'));
});

document.querySelectorAll('[data-job]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.slug) {
      window.location.href = `pages/vacancy.html?job=${encodeURIComponent(button.dataset.slug)}`;
      return;
    }
    modals.job.querySelector('#job-title').textContent = button.dataset.job;
    openModal(modals.job);
  });
});

document.querySelectorAll('.vacancy-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.vacancy-tabs button').forEach((tab) => {
      tab.classList.toggle('active', tab === button);
      tab.setAttribute('aria-selected', String(tab === button));
    });
    const selected = button.dataset.filter;
    document.querySelectorAll('.vacancy-group').forEach((group) => {
      const category = group.querySelector('[data-category]')?.dataset.category;
      group.hidden = selected !== 'all' && category !== selected;
    });
  });
});

function isAdultWithinRange(dateValue) {
  if (!dateValue) return false;
  const birthDate = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayPassed = today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!birthdayPassed) age -= 1;
  return age >= 18 && age <= 63;
}

document.querySelectorAll('form[data-form-name]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    status.className = 'form-status';

    if (!form.checkValidity()) {
      status.textContent = 'Проверьте заполнение обязательных полей и согласия.';
      status.classList.add('error');
      form.reportValidity();
      return;
    }

    const birthDate = form.elements.birthdate;
    if (birthDate && !isAdultWithinRange(birthDate.value)) {
      status.textContent = 'Возраст кандидата должен быть от 18 до 63 лет.';
      status.classList.add('error');
      birthDate.focus();
      return;
    }

    status.textContent = 'Форма готова. Отправка будет подключена после выбора сервиса заявок.';
    status.classList.add('success');
  });
});
