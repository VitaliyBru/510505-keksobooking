'use strict';

(function () {
  var ONE_HUNDRED_ROOMS = 100;
  var ZERO_GUESTS = 0;
  var MinRentPriceMap = {
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
    inputRentPrice.min = MinRentPriceMap[selectBuildingType.value];
    inputRentPrice.placeholder = MinRentPriceMap[selectBuildingType.value];
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
  // функция переводит страницу в активное состояние
  var activateAdForm = function () {
    formAdForm.classList.remove('ad-form--disabled');
    fieldsets.forEach(setDisabledOff);
    window.imagePreview.engage();
  };
  // Функция для перевода формы в неактивный режим
  var setAdFormToInactive = function () {
    formAdForm.reset();
    window.imagePreview.disengage();
    inputTitle.removeEventListener('invalid', onInvalidFire);
    inputRentPrice.removeEventListener('invalid', onInvalidFire);
    inputTitle.classList.remove('validity');
    inputRentPrice.classList.remove('validity');
    inactivateAdForm();
  };
  // Функция «препрег» для отправки данных формы на сервер
  var sendForm = function (onSuccesfullySend) {
    window.backend.send(new FormData(formAdForm), onSuccesfullySend,
        window.errorMessage.onError);
  };
  // Функция возвращает true если ошибок в заполнении формы не обнаружено
  var getFormValidity = function () {
    return formAdForm.checkValidity();
  };

  var formAdForm = document.querySelector('.ad-form');

  // ТЗ пункт 2.5 (синхронизация полей заезда и выезда)
  var selectTimein = formAdForm.querySelector('#timein');
  var selectTimeout = formAdForm.querySelector('#timeout');
  selectTimein.addEventListener('input', onTimeinSelectInput);
  selectTimeout.addEventListener('input', onTimeoutSelectInput);

  // ТЗ пункт 2.6 (синхронизация «Количество комнат» с полем «Количество мест»)
  var selectRooms = formAdForm.querySelector('#room_number');
  var selectCapacity = formAdForm.querySelector('#capacity');
  var optionsCapacity = selectCapacity.querySelectorAll('option');
  var optionsFragment = document.createDocumentFragment();
  selectRooms.addEventListener('input', onRoomsNumberInput);
  onRoomsNumberInput();

  // ТЗ пункт 2.3 «Тип жилья» определяет минимальное значение поля «Цена за ночь»
  var inputRentPrice = formAdForm.querySelector('#price');
  var selectBuildingType = formAdForm.querySelector('#type');
  selectBuildingType.addEventListener('input', onTypeSelectInput);
  onTypeSelectInput();

  // ТЗ 1.4 Страница реагирует на неправильно введённые значения в форму
  var inputTitle = formAdForm.querySelector('#title');
  inputTitle.addEventListener('invalid', onInvalidFire);
  inputRentPrice.addEventListener('invalid', onInvalidFire);

  var fieldsets = formAdForm.querySelectorAll('.ad-form fieldset');
  // Поле ввода адреса
  var inputAddress = formAdForm.querySelector('#address');

  window.form = {
    element: formAdForm,
    inputAddress: inputAddress,
    submit: sendForm,
    getValidity: getFormValidity,
    activate: activateAdForm,
    inactivate: setAdFormToInactive
  };
})();
