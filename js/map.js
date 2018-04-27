'use strict';

(function () {
  var ESC_KEYCODE = 27;

  // получаем блок мэп
  var mapContainer = document.querySelector('.map');

  var onMainPinFirstMouseup = function () {
    mapContainer.classList.remove('map--faded');
    window.pin.drawPinsOnMap();
    window.mainPin.pinEl.removeEventListener('mouseup', onMainPinFirstMouseup);
    window.mainPin.installDragDriver();
    window.form.activateAdForm();
    window.mainPin.setAddress();
    window.form.buttonReset.addEventListener('click', onResetButtonClick);
  };
  // Функция эмулирует нажатие клавиши ESCAPE
  var fireEscKeydownEvent = function () {
    var keydownEvt = new Event('keydown');
    keydownEvt.keyCode = ESC_KEYCODE;
    document.dispatchEvent(keydownEvt);
  };
  // Функция описывает действия по клику на кнопку reset в форме
  var onResetButtonClick = function () {
    mapContainer.classList.add('map--faded');
    fireEscKeydownEvent();
    window.pin.delitePins();
    window.mainPin.resetPosition();
    window.mainPin.uninstallDragDriver();
    window.mainPin.pinEl.addEventListener('mouseup', onMainPinFirstMouseup);
    window.form.buttonReset.removeEventListener('click', onResetButtonClick);
    window.form.setAdFormToInactive();
    window.mainPin.setAddress();
  };

  // Слушатель для активации сервиса keksobooking
  window.mainPin.pinEl.addEventListener('mouseup', onMainPinFirstMouseup);
})();
