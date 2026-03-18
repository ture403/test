const ITEM_HEIGHT = 60;

export function createWheel({
  container,
  min,
  max,
  initialValue,
  step = 1,
  onChange
}) {
  const wheelItems = container.querySelector('.wheel-items');

  let currentValue = normalizeValue(initialValue);
  let startY = 0;
  let isDragging = false;

  /* Utils */
  function normalizeValue(value) {
    const snapped =
      Math.round((value - min) / step) * step + min;
    return Math.max(min, Math.min(max, snapped));
  }

  function getIndexByValue(value) {
    return (value - min) / step;
  }

  /* Render */
  function render() {
    wheelItems.innerHTML = '';

    for (let value = min; value <= max; value += step) {
      const el = document.createElement('div');
      el.className = 'wheel-item';
      el.textContent = value;

      if (value === currentValue) {
        el.classList.add('selected');
      }

      wheelItems.appendChild(el);
    }

    center();
  }

  /* Center align */
  function center() {
    const index = getIndexByValue(currentValue);
    const offset = -index * ITEM_HEIGHT;

    wheelItems.style.transform = `translateY(${offset}px)`;

    wheelItems.querySelectorAll('.wheel-item').forEach(el => {
      el.classList.toggle(
        'selected',
        Number(el.textContent) === currentValue
      );
    });
  }

  /* Pointer Events */
  function onPointerDown(e) {
    isDragging = true;
    startY = e.clientY;
    container.setPointerCapture(e.pointerId);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    const delta = e.clientY - startY;
    const movedSteps = Math.trunc(delta / ITEM_HEIGHT);

    if (movedSteps === 0) return;

    const nextValue = normalizeValue(
      currentValue - movedSteps * step
    );

    if (nextValue !== currentValue) {
      currentValue = nextValue;
      startY = e.clientY;

      center();
      onChange?.(currentValue);
    }
  }

  function onPointerUp(e) {
    isDragging = false;

    container.releasePointerCapture(e.pointerId);
    container.removeEventListener('pointermove', onPointerMove);
    container.removeEventListener('pointerup', onPointerUp);
    container.removeEventListener('pointercancel', onPointerUp);
  }

  /* Init */
  container.addEventListener('pointerdown', onPointerDown);
  render();

  /* Public API */
  return {
    getValue() {
      return currentValue;
    },

    setValue(value) {
      currentValue = normalizeValue(value);
      center();
    }
  };
}
