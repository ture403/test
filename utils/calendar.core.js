
dayjs.extend(dayjs_plugin_weekday);
dayjs.extend(dayjs_plugin_isoWeek);
dayjs.extend(dayjs_plugin_isToday);

/* Calendar Core */
export function createCalendarCore({
  container,
  type = 'basic',           // basic | select | routine
  selectedDate = null,
  routineData = {},
  onSelect,
}) {
  let currentDate = dayjs();
  let pickerEl = null;
  let selectedYear = currentDate.year();
  let selectedMonth = currentDate.month() + 1;
  let activeCell = null; // basic / select 선택용

  const titleEl = container.querySelector('.year-month');
  const gridEl = container.querySelector('.calendar-grid');
  const weekdaysEl = container.querySelector('.calendar-weekdays');

  init();
  bindHeaderEvents();
  bindPickerEvents();

  /* Init */
  function init() {
    renderWeekdays();
    render();
  }

  /* Header Events */
  function bindHeaderEvents() {
    container.querySelector('.prev-btn')
      ?.addEventListener('click', () => {
        currentDate = currentDate.subtract(1, 'month');
        syncPickerState();
        render();
      });

    container.querySelector('.next-btn')
      ?.addEventListener('click', () => {
        currentDate = currentDate.add(1, 'month');
        syncPickerState();
        render();
      });
  }

  /* Picker Events */
  function bindPickerEvents() {
    const arrow = container.querySelector('.picker-arrow');
    if (!arrow) return;
    arrow.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePicker();
    });
    document.addEventListener('click', (e) => {
      if (pickerEl && !container.contains(e.target)) {
        closePicker();
      }
    });
  }

  function togglePicker() {
    pickerEl ? closePicker() : openPicker();
  }

  function openPicker() {
    pickerEl = document.createElement('div');
    pickerEl.className = 'year-month-picker';

    pickerEl.innerHTML = `
      <div class="picker-col year-col">
        ${renderYearItems()}
      </div>
      <div class="picker-col month-col">
        ${renderMonthItems()}
      </div>
    `;
    container.querySelector('.calendar-header')?.appendChild(pickerEl);
    bindPickerItemEvents();
  }

  function closePicker() {
    pickerEl?.remove();
    pickerEl = null;
  }

  function bindPickerItemEvents() {
    pickerEl.querySelectorAll('[data-year]').forEach(item => {
      item.addEventListener('click', () => {
        selectedYear = Number(item.dataset.year);
        updateActive(item, 'year');
        applyPickerDate();
      });
    });

    pickerEl.querySelectorAll('[data-month]').forEach(item => {
      item.addEventListener('click', () => {
        selectedMonth = Number(item.dataset.month);
        updateActive(item, 'month');
        applyPickerDate();
      });
    });
  }

  function updateActive(target, type) {
    const selector = type === 'year' ? '[data-year]' : '[data-month]';
    pickerEl.querySelectorAll(selector)
      .forEach(el => el.classList.remove('active'));
    target.classList.add('active');
  }

  function applyPickerDate() {
    currentDate = dayjs()
      .year(selectedYear)
      .month(selectedMonth - 1)
      .date(1);
    render();
    closePicker();
  }

  function syncPickerState() {
    selectedYear = currentDate.year();
    selectedMonth = currentDate.month() + 1;
  }

  function renderYearItems() {
    const nowYear = dayjs().year();
    let html = '';

    for (let y = nowYear - 10; y <= nowYear + 10; y++) {
      html += `
        <div class="picker-item ${y === selectedYear ? 'active' : ''}"
             data-year="${y}">
          ${y}년
        </div>
      `;
    }
    return html;
  }

  function renderMonthItems() {
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return `
        <div class="picker-item ${month === selectedMonth ? 'active' : ''}"
             data-month="${month}">
          ${month}월
        </div>
      `;
    }).join('');
  }

  /* ============================
   * Render Calendar
   * ============================ */
  function render() {
    titleEl.textContent = currentDate.format('YYYY.MM');
    gridEl.innerHTML = '';
    activeCell = null;

    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startWeekday = startOfMonth.day();
    const prevMonthEnd = startOfMonth.subtract(1, 'day');

    for (let i = startWeekday - 1; i >= 0; i--) {
      gridEl.appendChild(
        createEmptyCell(prevMonthEnd.subtract(i, 'day'))
      );
    }

    for (let d = 1; d <= endOfMonth.date(); d++) {
      gridEl.appendChild(
        createDayCell(currentDate.date(d))
      );
    }

    const totalCells = startWeekday + endOfMonth.date();
    const remain = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

    for (let i = 1; i <= remain; i++) {
      gridEl.appendChild(
        createEmptyCell(endOfMonth.add(i, 'day'))
      );
    }
  }

  /* ============================
   * Weekdays
   * ============================ */
  function renderWeekdays() {
    const labels = ['일', '월', '화', '수', '목', '금', '토'];
    weekdaysEl.innerHTML = labels.map((label, i) => {
      const isWeekend = i === 0 || i === 6;
      return `<div class="weekday${isWeekend ? ' weekend' : ''}">${label}</div>`;
    }).join('');
  }

  /* ============================
   * Day Cell
   * ============================ */
  function createDayCell(date) {
    const div = document.createElement('div');
    div.className = 'day-cell';

    const key = date.format('YYYY-MM-DD');
    const hasRoutine =
      type === 'routine' &&
      Object.prototype.hasOwnProperty.call(routineData, key);

    if (type === 'routine' && !hasRoutine) {
      div.classList.add('not-routine');
    }

    if (date.isToday()) div.classList.add('today');

    if (selectedDate && date.isSame(selectedDate, 'day')) {
      div.classList.add('selected');
      activeCell = div;
    }

    if ([0, 6].includes(date.day())) {
      div.classList.add('weekend');
    }

    div.innerHTML = `
      <span class="day-number">${date.date()}</span>
      ${date.isToday() ? '<span class="day-text">오늘</span>' : ''}
      ${renderTypeUI(type, date)}
    `;

    div.addEventListener('click', () => {
      if (type === 'basic' || type === 'select') {
        activeCell?.classList.remove('selected');
        div.classList.add('selected');
        activeCell = div;
      }

      onSelect?.(date);
    });

    return div;
  }

  function createEmptyCell(date) {
    const div = document.createElement('div');
    div.className = 'day-cell empty';

    if ([0, 6].includes(date.day())) {
      div.classList.add('weekend');
    }

    div.innerHTML = `<span class="day-number">${date.date()}</span>`;
    return div;
  }

  /* ============================
   * Type UI
   * ============================ */
  function renderTypeUI(type, date) {
    if (type === 'routine') {
      const key = date.format('YYYY-MM-DD');
      if (!Object.prototype.hasOwnProperty.call(routineData, key)) return '';

      const value = routineData[key];
      const R = 17.5;
      const C = 2 * Math.PI * R;
      const offset = C * (1 - value / 100);

      return `
        <div class="routine-progress">
          ${
            value < 100
              ? `
                <div class="progress">
                  <svg width="40" height="40" viewBox="0 0 40 40"
                       xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="${R}"
                      fill="none" stroke="#E9ECF3" stroke-width="5" />
                    <circle cx="20" cy="20" r="${R}"
                      fill="none" stroke="#39B695" stroke-width="5"
                      stroke-linecap="round"
                      stroke-dasharray="${C}"
                      stroke-dashoffset="${offset}"
                      transform="rotate(-90 20 20)" />
                  </svg>
                  <span class="svg-text">${value}%</span>
                </div>
              `
              : `
                <div class="routine-ok">
                  <i class="ico-square-check"></i>
                  <span class="svg-text">100%</span>
                </div>
              `
          }
        </div>
      `;
    }

    if (type === 'select') {
      return `<span class="dot"></span>`;
    }

    return '';
  }
}
