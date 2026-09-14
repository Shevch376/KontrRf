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

function trackGoal(goalName) {
  if (typeof window.ym === 'function') {
    window.ym(112544225, 'reachGoal', goalName);
  }
  if (Array.isArray(window._tmr)) {
    window._tmr.push({ id: '3793921', type: 'reachGoal', goal: goalName });
  }
}

document.querySelectorAll('a[href$="#application"]').forEach((link) => {
  link.addEventListener('click', () => trackGoal('application_click'));
});

document.querySelectorAll('[data-open-modal="callback"]').forEach((button) => {
  button.addEventListener('click', () => trackGoal('callback_click'));
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
    ['rear-paramedic','Фельдшер'], ['rear-surgeon','Хирург'], ['gumo-specialist','Специалист 12 ГУМО'], ['guard','Охранник'], ['auto-locksmith','Автослесарь']
  ],
  women: [
    ['military-doctor','Врач-хирург'], ['paramedic','Фельдшер'], ['nurse','Медицинская сестра'], ['orderly','Санитар'], ['sanitary-instructor','Санитарный инструктор']
  ]
};
window.jobCatalog = jobCatalog;

const categoryPrefix = {
  frontline: 'СВО',
  rear: 'ТЫЛ',
  women: 'Для женщин'
};

const findJobBySlug = (slug) => Object.entries(jobCatalog)
  .flatMap(([category, jobs]) => jobs.map(([jobSlug, title]) => ({ category, slug: jobSlug, title })))
  .find((item) => item.slug === slug);

const requestedApplicationJob = new URLSearchParams(window.location.search).get('job');
const requestedApplicationEntry = requestedApplicationJob ? findJobBySlug(requestedApplicationJob) : null;
const requestedVacancySelect = document.querySelector('select[name="vacancy"]');

if (requestedVacancySelect && requestedApplicationEntry) {
  const requestedVacancyValue = `${categoryPrefix[requestedApplicationEntry.category]} — ${requestedApplicationEntry.title}`;
  if ([...requestedVacancySelect.options].some((option) => option.value === requestedVacancyValue)) {
    requestedVacancySelect.value = requestedVacancyValue;
  }
}

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
  'rear-driver': 'photos/rear-driver-new.jpg',
  'mechanic-driver': 'verified/rear-repair-final.webp',
  'auto-mechanic': 'photos/auto-mechanic-new.jpg',
  'fuel-truck-driver': 'photos/fuel-truck-driver-new.jpg',
  welder: 'photos/welder-new.jpg',
  electrician: 'photos/electrician-new.jpg',
  'rear-drone-repair': 'verified/drone.webp',
  'water-supply-specialist': 'verified/rear-supply.webp',
  'rear-paramedic': 'photos/paramedic-new.jpg',
  'rear-surgeon': 'photos/surgeon-new.jpg',
  'gumo-specialist': 'photos/gumo-specialist.webp',
  guard: 'photos/guard-new.jpg',
  'auto-locksmith': 'photos/auto-locksmith-new.jpg',
  'military-doctor': 'example-medical/medical-01.webp',
  paramedic: 'photos/paramedic-new.jpg',
  nurse: 'example-medical/medical-02.webp',
  orderly: 'example-medical/medical-03.webp',
  'sanitary-instructor': 'example-medical/medical-05.webp'
};

const jobImage = (slug, title) => {
  const source = `${photoRoot}${jobPhotos[slug]}`;
  return `<div class="job-image job-image-${slug}" style="background-image:url('${source}')"><img src="${source}" alt="${title}" decoding="async"></div>`;
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
  const normalizedValue = dateValue.trim();
  let match = normalizedValue.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  let day;
  let month;
  let year;

  if (match) {
    day = Number(match[1]);
    month = Number(match[2]);
    year = Number(match[3]);
  } else {
    match = normalizedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return false;
    year = Number(match[1]);
    month = Number(match[2]);
    day = Number(match[3]);
  }

  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) return false;
  if (Number.isNaN(birthDate.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayPassed = today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!birthdayPassed) age -= 1;
  return age >= 18 && age <= 63;
}

const FORM_ENDPOINT = 'api/send-lead.php';
const FORM_TIMEOUT_MS = 10000;

function sendLead(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FORM_TIMEOUT_MS);

  return fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: controller.signal
  }).finally(() => clearTimeout(timeout));
}

function collectFormData(form) {
  const formData = new FormData(form);
  const payload = {
    formName: form.dataset.formName || '',
    page: window.location.href,
    fields: {}
  };

  formData.forEach((value, key) => {
    const field = form.elements[key];
    payload.fields[key] = field?.type === 'checkbox'
      ? (field.checked ? 'Да' : 'Нет')
      : String(value).trim();
  });

  return payload;
}

document.querySelectorAll('form[data-form-name]').forEach((form) => {
  form.addEventListener('input', () => {
    if (form.dataset.started) return;
    form.dataset.started = 'true';
    trackGoal(form.dataset.formName === 'callback' ? 'callback_started' : 'application_started');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    const submitButton = form.querySelector('[type="submit"]');
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

    status.textContent = 'Отправляем заявку...';
    status.classList.add('loading');
    submitButton.disabled = true;

    try {
      const response = await sendLead(collectFormData(form));
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Не удалось отправить заявку.');
      }

      status.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
      status.classList.add('success');
      trackGoal(form.dataset.formName === 'callback' ? 'callback_submit_success' : 'lead_submit_success');
      form.reset();
      if (form.closest('.modal')) {
        setTimeout(() => closeModal(form.closest('.modal')), 1200);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        status.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
        status.classList.add('success');
        trackGoal(form.dataset.formName === 'callback' ? 'callback_submit_success' : 'lead_submit_success');
        form.reset();
        return;
      }
      status.textContent = error.message || 'Не удалось отправить заявку. Попробуйте позже.';
      status.classList.add('error');
    } finally {
      submitButton.disabled = false;
    }
    return;
  });
});
