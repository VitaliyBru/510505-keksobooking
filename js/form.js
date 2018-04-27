'use strict';

(function () {
  var ONE_HUNDRED_ROOMS = 100;
  var ZERO_GUESTS = 0;
  var minRentPrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  // Функция задает время выезда на основе времени заезда
  var onTimeinSelectInput = function (evt) {
    selectTimeout.selectedIndex = evt.target.selectedIndex;
  };
  // Функция задает время заезда на основе времени выезда
  var onTimeoutSelectInput = function (evt) {
    selectTimein.selectedIndex = evt.target.selectedIndex;
  };
  // Функция отбирает доступные варианты кол-ва гостей для выбранного кол-ва комнат
  var setSelectOptions = function (option) {
    var roomsNumber = selectRooms.value;
    var guestsNumber = option.value;
    // Если комнат меньше ста – гостей больше ноля, но не больше чем комнат
    // ИЛИ для ста комнат – ноль гостей
    if ((guestsNumber <= roomsNumber && roomsNumber < ONE_HUNDRED_ROOMS
      && guestsNumber > ZERO_GUESTS) || (guestsNumber === ZERO_GUESTS.toString()
      && roomsNumber === ONE_HUNDRED_ROOMS.toString())) {
      optionsFragment.appendChild(option);
    }
  };
  // Функция задает варианты соответствий между кол-вом комнат и гостей
  var onRoomsNumberInput = function () {
    optionsCapacity.forEach(setSelectOptions);
    selectCapacity.innerHTML = '';
    selectCapacity.appendChild(optionsFragment);
    selectCapacity.selectedIndex = 0;
  };
  // Функция выставляет нижнюю границу цены аренды от типа строения
  var onTypeSelectInput = function () {
    inputRentPrice.min = minRentPrice[selectBuildingType.value];
    inputRentPrice.placeholder = minRentPrice[selectBuildingType.value];
  };
  var onInvalidFire = function (evt) {
    evt.target.classList.add('validity');
  };
  // Функуия добавляет элементу атрибут disable
  var setDisabledOff = function (htmlElement) {
    htmlElement.disabled = false;
  };
  // Функуия отключает элементу атрибут disable
  var setDisabledOn = function (htmlElement) {
    htmlElement.disabled = true;
  };
  // функция переводит страницу в не активное состояние
  var inactivateAdForm = function () {
    formAdForm.classList.add('ad-form--disabled');
    fieldsets.forEach(setDisabledOn);
  };

  // ТЗ пункт 2.5 (синхронизация полей заезда и выезда)
  var selectTimein = document.getElementById('timein');
  var selectTimeout = document.getElementById('timeout');
  selectTimein.addEventListener('input', onTimeinSelectInput);
  selectTimeout.addEventListener('input', onTimeoutSelectInput);

  // ТЗ пункт 2.6 (синхронизация «Количество комнат» с полем «Количество мест»)
  var selectRooms = document.getElementById('room_number');
  var selectCapacity = document.getElementById('capacity');
  var optionsCapacity = selectCapacity.querySelectorAll('option');
  var optionsFragment = document.createDocumentFragment();
  selectRooms.addEventListener('input', onRoomsNumberInput);
  onRoomsNumberInput();

  // ТЗ пункт 2.3 «Тип жилья» определяет минимальное значение поля «Цена за ночь»
  var inputRentPrice = document.getElementById('price');
  var selectBuildingType = document.getElementById('type');
  selectBuildingType.addEventListener('input', onTypeSelectInput);
  onTypeSelectInput();

  // ТЗ 1.4 Страница реагирует на неправильно введённые значения в форму
  var inputTitle = document.getElementById('title');
  inputTitle.addEventListener('invalid', onInvalidFire);
  inputRentPrice.addEventListener('invalid', onInvalidFire);

  var formAdForm = document.querySelector('.ad-form');
  var fieldsets = formAdForm.querySelectorAll('.ad-form fieldset');

  window.form = {
    buttonReset: formAdForm.querySelector('.ad-form__reset'),
    // Поле ввода адреса
    inputAddress: document.querySelector('#address'),
    // функция переводит страницу в активное состояние
    activateAdForm: function () {
      formAdForm.classList.remove('ad-form--disabled');
      fieldsets.forEach(setDisabledOff);
    },
    // Функция для перевода формы в неактивный режим
    setAdFormToInactive: function () {
      formAdForm.reset();
      inputTitle.removeEventListener('invalid', onInvalidFire);
      inputRentPrice.removeEventListener('invalid', onInvalidFire);
      inputTitle.classList.remove('validity');
      inputRentPrice.classList.remove('validity');
      inactivateAdForm();
    }
  };
})();