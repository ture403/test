import { initSwiper } from './ui_swiper.js';

export const initCsBoxToggle = () => {
  const buttons = document.querySelectorAll('.cs-box-toggle button');
  buttons.forEach(button => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    const boxIn = button.closest('.cs-box-in');
    const isOpen = boxIn?.classList.contains('open');
    button.setAttribute('aria-expanded', String(isOpen));
    button.addEventListener('click', () => {
      const boxIn = button.closest('.cs-box-in');
      if (!boxIn) return;
      const open = boxIn.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initSwiper();
  initCsBoxToggle();
});

