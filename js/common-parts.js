'use strict';

(function () {
  var ESC_KEYCODE = 27;
  // Функция эмулирует нажатие клавиши ESCAPE
  var fireEscKeydownEvent = function () {
    var keydownEvt = new Event('keydown');
    keydownEvt.keyCode = ESC_KEYCODE;
    document.dispatchEvent(keydownEvt);
  };

  window.commonParts = {
  	fireEscKeydownEvent: fireEscKeydownEvent
  }
})();