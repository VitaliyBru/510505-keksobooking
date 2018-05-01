'use strict';

(function () {
  var STEPS_QUANTITY = 5;
  var TIMER_STEP_DURATION = 1000;
  var container = document.querySelector('.map__pins');
  // Функция отрисовывает сообщение об ошибке
  var onError = function (errorMessage) {
    var errorMessageEl = document.createElement('div');
    var brEl = document.createElement('br');
    var buttonEl = document.createElement('button');
    var timerId = null;
    var timeLeft = STEPS_QUANTITY;
    // Функция для обратного отсчета времени до авто закрытия popup(-а)
    var timer = function () {
      timeLeft--;
      if (!timeLeft) {
        container.removeChild(errorMessageEl);
        return;
      }
      buttonEl.textContent = 'закрыть (' + timeLeft + 'сек)';
      timerId = setTimeout(timer, TIMER_STEP_DURATION);
    };
    // Создаем элемент с текстом сообщения об ошибке
    errorMessageEl.textContent = errorMessage;
    errorMessageEl.appendChild(brEl);
    buttonEl.textContent = 'закрыть (' + timeLeft + 'сек)';
    errorMessageEl.appendChild(buttonEl);
    errorMessageEl.classList.add('error__message');
    container.appendChild(errorMessageEl);
    buttonEl.addEventListener('click', function () {
      clearTimeout(timerId);
      container.removeChild(errorMessageEl);
    });
    // Старт обратного отсчета
    timerId = setTimeout(timer, TIMER_STEP_DURATION);
  };

  window.errorMessage = {
    onError: onError
  };
})();
