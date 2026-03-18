import { createCalendarCore } from "./calendar.core.js";

let selectedDate = null;

createCalendarCore({
  container: document.querySelector('[data-type="select"]'),
  type: "select",
  selectedDate,
  onSelect(date) {
    selectedDate = date;
    console.log("선택 날짜:", date.format("YYYY-MM-DD"));
  },
});
