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

document.querySelectorAll('input[type="tel"]').forEach((input) => {
  input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);
    const local = digits.startsWith('7') ? digits.slice(1) : digits;
    let value = '+7';
    if (local.length) value += ` (${local.slice(0, 3)}`;
    if (local.length >= 3) value += ')';
    if (local.length > 3) value += ` ${local.slice(3, 6)}`;
    if (local.length > 6) value += `-${local.slice(6, 8)}`;
    if (local.length > 8) value += `-${local.slice(8, 10)}`;
    input.value = value;
  });
});

document.querySelectorAll('input[type="date"]').forEach((input) => {
  input.addEventListener('click', () => {
    input.focus();
    try {
      input.showPicker?.();
    } catch (error) {
      // Some browsers restrict showPicker; focus still keeps the whole field usable.
    }
  });
});

const jobCatalog = {
  frontline: [
    ['driver','Водитель'], ['drone-operator','Оператор БПЛА'], ['sapper','Сапёр'], ['sniper','Снайпер'],
    ['grenade-launcher','Гранатомётчик'], ['air-defense-operator','Оператор ЗРК'], ['assault-soldier','Штурмовик'], ['scout','Разведчик'],
    ['rubicon-operator','Оператор подразделения «Рубикон»'], ['tanker','Танкист'], ['tank-division-specialist','Специалист танковой дивизии'], ['rifleman','Стрелок'],
    ['frontline-paramedic','Фельдшер'], ['cook','Повар'], ['artilleryman','Артиллерист'], ['frontline-surgeon','Врач-хирург'],
    ['signalman','Связист'], ['frontline-mechanic-driver','Водитель-механик'], ['squad-commander','Командир отделения'], ['staff-instructor','Инструктор штаба']
  ],
  rear: [
    ['rear-driver','Водитель'], ['mechanic-driver','Механик-водитель'], ['auto-mechanic','Автомеханик'], ['fuel-truck-driver','Заправщик'],
    ['welder','Сварщик'], ['electrician','Электрик'], ['rear-drone-repair','Специалист по ремонту БПЛА'], ['water-supply-specialist','Специалист по водообеспечению'],
    ['rear-paramedic','Фельдшер'], ['rear-surgeon','Хирург'], ['gumo-specialist','Специалист 12 ГУМО'], ['guard','Сторож'], ['auto-locksmith','Автослесарь']
  ],
  women: [
    ['military-doctor','Врач-хирург'], ['paramedic','Фельдшер'], ['nurse','Медицинская сестра'], ['orderly','Санитар'], ['sanitary-instructor','Санитарный инструктор']
  ]
};
window.jobCatalog = jobCatalog;

const categoryText = {
  frontline: 'Задачи в составе боевых, инженерных, транспортных и специальных подразделений.',
  rear: 'Техническое обслуживание, перевозки и обеспечение устойчивой работы подразделений.',
  women: 'Медицинская помощь в пределах профильного образования и подтверждённой квалификации.'
};

const photoRoot = window.location.pathname.replace(/\\/g, '/').includes('/pages/') ? '../assets/images/' : 'assets/images/';
const jobPhotos = {
  driver: 'example-front/card-02.webp',
  'drone-operator': 'example-front/drone.webp',
  sapper: 'verified/sapper.webp',
  sniper: 'verified/sniper.webp',
  'grenade-launcher': 'example-front/grenade.webp',
  'air-defense-operator': 'example-front/air-defense.webp',
  'assault-soldier': 'example-front/assault.webp',
  scout: 'example-front/scout.webp',
  'rubicon-operator': 'example-front/card-10.webp',
  tanker: 'example-front/card-13.webp',
  'tank-division-specialist': 'example-front/card-11.webp',
  rifleman: 'verified/shooter.webp',
  'frontline-paramedic': 'example-front/card-14.webp',
  cook: 'example-front/card-15.webp',
  artilleryman: 'example-front/card-16.webp',
  'frontline-surgeon': 'example-front/card-17.webp',
  signalman: 'example-front/card-18.webp',
  'frontline-mechanic-driver': 'example-front/card-21.webp',
  'squad-commander': 'example-front/card-20.webp',
  'staff-instructor': 'photos/staff-instructor.webp',
  'rear-driver': 'verified/rear-driver.webp',
  'mechanic-driver': 'verified/rear-repair-final.webp',
  'auto-mechanic': 'verified/rear-repair-final.webp',
  'fuel-truck-driver': 'verified/rear-driver.webp',
  welder: 'photos/welder.webp',
  electrician: 'verified/rear-electric-final.webp',
  'rear-drone-repair': 'verified/drone.webp',
  'water-supply-specialist': 'verified/rear-supply.webp',
  'rear-paramedic': 'verified/specialist-medic-2.webp',
  'rear-surgeon': 'verified/specialist-medic-6.webp',
  'gumo-specialist': 'photos/gumo-specialist.webp',
  guard: 'verified/brigade.webp',
  'auto-locksmith': 'verified/rear-repair-final.webp',
  'military-doctor': 'example-medical/medical-01.webp',
  paramedic: 'example-medical/medical-04.webp',
  nurse: 'example-medical/medical-02.webp',
  orderly: 'example-medical/medical-03.webp',
  'sanitary-instructor': 'example-medical/medical-05.webp'
};

const jobImage = (slug, title) => {
  const source = `${photoRoot}${jobPhotos[slug]}`;
  return `<div class="job-image" style="background-image:url('${source}')"><img src="${source}" alt="${title}" decoding="async"></div>`;
};

document.querySelectorAll('.job-grid[data-category], .catalog-section .catalog-job-grid').forEach((grid) => {
  const category = grid.dataset.category || grid.closest('.catalog-section')?.id;
  if (!jobCatalog[category]) return;
  const isCatalog = grid.classList.contains('catalog-job-grid');
  grid.innerHTML = jobCatalog[category].map(([slug, title], index) => {
    const qualification = slug === 'driver' ? '<span class="job-qualification">Водитель категорий (A, B, C, D, E)</span>' : '';
    return isCatalog
    ? `<article class="catalog-job">${jobImage(slug, title)}<div><h3>${title}</h3>${qualification}<p>${categoryText[category]}</p><a href="vacancy.html?job=${slug}">Подробнее</a></div></article>`
    : `<article class="job-card">${jobImage(slug, title)}<h4>${title}</h4>${qualification}<button type="button" data-job="${title}" data-slug="${slug}">Подробнее</button></article>`;
  }
  ).join('');
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
