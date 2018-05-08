'use strict';

(function () {
  // получаем блок мэп
  var mapContainer = document.querySelector('.map');

  var onMainPinFirstMouseup = function () {
    mapContainer.classList.remove('map--faded');
    window.pin.showSimilar();
    window.mainPin.element.removeEventListener('mouseup', onMainPinFirstMouseup);
    window.form.activate();
    window.mainPin.setAddress();
    window.form.element.addEventListener('submit', onSubmitButtonClick);
    window.form.element.addEventListener('reset', onResetButtonClick);
  };
  // Функция описывает действия по клику на кнопку reset в форме
  var onResetButtonClick = function () {
    mapContainer.classList.add('map--faded');
    window.commonParts.fireEscKeydownEvent();
    window.pin.delete();
    window.mainPin.resetPosition();
    window.mainPin.element.addEventListener('mouseup', onMainPinFirstMouseup);
    window.form.element.removeEventListener('submit', onSubmitButtonClick);
    window.form.element.removeEventListener('reset', onResetButtonClick);
    window.form.inactivate();
    window.filters.disengage();
    window.mainPin.setAddress();
  };
  // Функция выполняется после успешной отправки данных формы на сервер
  var onSuccesfullySend = function () {
    onResetButtonClick();
    document.querySelector('.success').classList.remove('hidden');
  };
  // Функция выполняется при клике на кнопку формы «отправить»
  var onSubmitButtonClick = function (evt) {
    evt.preventDefault();
    if (window.form.getValidity()) {
      window.form.submit(onSuccesfullySend);
    }
  };

  // Слушатель для активации сервиса keksobooking
  window.mainPin.element.addEventListener('mouseup', onMainPinFirstMouseup);
})();
