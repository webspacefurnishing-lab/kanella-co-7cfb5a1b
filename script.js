(() => {
  const formatDate = value => new Date(value + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const reveal = element => {
    element.hidden = false;
    element.focus({ preventScroll: true });
    element.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  };
  const dialog = document.getElementById('event-dialog');
  const opener = document.querySelector('[data-open-event]');
  if (dialog && opener && typeof dialog.showModal === 'function') {
    const closeButton = dialog.querySelector('.close-dialog');
    const form = document.getElementById('event-form');
    const result = document.getElementById('event-result');
    opener.hidden = false;
    opener.addEventListener('click', () => {
      dialog.showModal();
      document.documentElement.classList.add('dialog-open');
      dialog.scrollTop = 0;
      closeButton.focus({ preventScroll: true });
    });
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('dialog-open');
      opener.focus({ preventScroll: true });
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [String(data.get('occasion'))];
      if (data.get('date')) lines.push('Preferred date: ' + formatDate(String(data.get('date'))));
      if (data.get('guests')) lines.push('Guests: ' + data.get('guests'));
      const notes = String(data.get('notes') || '').trim();
      if (notes) lines.push(notes);
      result.querySelector('.event-summary').textContent = lines.join('\n');
      reveal(result);
    });
    const hideEventResult = () => { result.hidden = true; };
    form.addEventListener('input', hideEventResult);
    form.addEventListener('change', hideEventResult);
  }
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    const dateInput = document.getElementById('visit-date');
    const timeInput = document.getElementById('visit-time');
    const result = document.getElementById('booking-result');
    const setMinimumDate = () => {
      const now = new Date();
      dateInput.min = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
    };
    setMinimumDate();
    bookingForm.addEventListener('focusin', setMinimumDate);
    const hideBookingResult = () => { result.hidden = true; };
    bookingForm.addEventListener('input', hideBookingResult);
    bookingForm.addEventListener('change', hideBookingResult);
    bookingForm.addEventListener('submit', event => {
      event.preventDefault();
      setMinimumDate();
      if (!bookingForm.reportValidity()) return;
      const data = new FormData(bookingForm);
      const lines = [
        'Preferred date: ' + formatDate(String(data.get('date'))),
        'Preferred time: ' + timeInput.value,
        'Guests: ' + data.get('guests')
      ];
      const notes = String(data.get('notes') || '').trim();
      if (notes) lines.push('Notes: ' + notes);
      result.querySelector('.visit-summary').textContent = lines.join('\n');
      reveal(result);
    });
    document.getElementById('edit-visit').addEventListener('click', () => {
      result.hidden = true;
      dateInput.focus({ preventScroll: true });
      dateInput.scrollIntoView({ block: 'center', behavior: 'auto' });
    });
    bookingForm.hidden = false;
  }
})();
