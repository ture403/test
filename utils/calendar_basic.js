import { createCalendarCore } from "./calendar.core.js";

createCalendarCore({
  container: document.querySelector('[data-type="basic"]'),
  type: 'basic',
});

