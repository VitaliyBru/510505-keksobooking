'use strict';

(function () {
  var MAIN_PIN = {
    dimansions: {
      height: 80,
      width: 64
    },
    startPosition: {
      left: '570px',
      top: '375px'
    }
  };
  var BoundaryPinMove = {
    minX: 0,
    minY: 150 - MAIN_PIN.dimansions.height,
    maxX: 1200 - MAIN_PIN.dimansions.width,
    maxY: 620
  };
  // Получаем пин польлзователя .map__pin--main
  var mainPin = document.querySelector('.map__pin--main');

  // Возвращает координаты острия пина
  var getNailPinPosition = function (style) {
    return (parseInt(style.left, 10) + MAIN_PIN.dimansions.width / 2) + ', '
        + (parseInt(style.top, 10) + MAIN_PIN.dimansions.height);
  };
  // Функция возвращает откорректированную величину в заданных рамках
  var getValueInRange = function (value, minValue, maxValue) {
    if (value < minValue) {
      value = minValue;
    }
    if (value > maxValue) {
      value = maxValue;
    }
    return value;
  };
  // Функция перемещает «map__pin--main» вслед за курсором и записывает
  // адрес в поле формы «адрес»
  var onMainPinMousemove = function (evt) {
    var positionX = parseInt(mainPin.style.left, 10) + evt.movementX;
    positionX = getValueInRange(positionX, BoundaryPinMove.minX,
        BoundaryPinMove.maxX);
    var positionY = parseInt(mainPin.style.top, 10) + evt.movementY;
    positionY = getValueInRange(positionY, BoundaryPinMove.minY,
        BoundaryPinMove.maxY);
    mainPin.style.left = positionX + 'px';
    mainPin.style.top = positionY + 'px';
    window.mainPin.setAddress();
  };
  // Действия по нажатию мышкой на элементе «map__pin--main»
  var onMainPinMousedown = function () {
    document.addEventListener('mousemove', onMainPinMousemove);
    document.addEventListener('mouseup', onMainPinMouseup);
    window.pin.container.addEventListener('mouseleave',
        onMainPinMouseup);
  };
  // Действия при отпускании клавиши мышки и покидании курсором зоны контейнера
  // после нажания на элементе «map__pin--main»
  var onMainPinMouseup = function () {
    document.removeEventListener('mousemove', onMainPinMousemove);
    document.removeEventListener('mouseup', onMainPinMouseup);
    window.pin.container.removeEventListener('mouseleave',
        onMainPinMouseup);
  };
  // Функция записывает координаты острия пина пользователя в поле формы адресс
  var setAddress = function () {
    window.form.inputAddress.value = getNailPinPosition(mainPin.style);
  };
  // Функция сбрасывает пин пользователя на координаты по умолчанию
  var resetPosition = function () {
    mainPin.style.left = MAIN_PIN.startPosition.left;
    mainPin.style.top = MAIN_PIN.startPosition.top;
  };
  // Активируем возможноть перемещать пин пользователя по карте
  mainPin.addEventListener('mousedown', onMainPinMousedown);

  window.mainPin = {
    element: mainPin,
    setAddress: setAddress,
    resetPosition: resetPosition
  };
})();
