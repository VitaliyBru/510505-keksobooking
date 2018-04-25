'use strict';

var PIN_DIMENSIONS = {
  height: 70,
  width: 50
};
var MAIN_PIN = {
  dimansions: {
    height: 80,
    width: 64
  },
  startPosition: {
    left: 570,
    top: 375
  }
};
var ESC_KEYCODE = 27;
var typeInRussian = {
  palace: 'дворец',
  flat: 'квартира',
  house: 'дом',
  bungalo: 'лачуга'
};
var minRentPrice = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};
var ONE_HUNDRED_ROOMS = 100;
var ZERO_GUESTS = 0;
var boundaryPinMove = {
    minX: 300,
    minY: 150,
    maxX: 900 - MAIN_PIN.dimansions.width,
    maxY: 500
  };

var Announcement = function () {
  this.author = {
    avatar: ''
  };

  this.offer = {
    title: '',
    address: '',
    price: null,
    type: '',
    rooms: null,
    guests: null,
    checkin: '',
    checkout: '',
    features: [],
    description: '',
    photos: []
  };

  this.location = {
    x: null,
    y: null
  };
};

// Эмулирует данные получаемые от пользователя
var announcementDataGenerator = {
  titleList: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  boundaryMap: {
    minX: 300,
    minY: 150,
    maxX: 900,
    maxY: 500
  },
  boundaryPrice: {
    min: 1000,
    max: 1000000
  },
  typeList: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  timeList: [
    '12:00',
    '13:00',
    '14:00'
  ],
  featuresList: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  photosList: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],
  index: 0,
  rooms: {
    min: 1,
    max: 5
  },

  getUniqueTitle: function () {
    this.index--;
    if (this.index < 0) {
      this.titleArray = shuffleArray(this.titleList, this.titleList.length);
      this.index = this.titleArray.length - 1;
    }
    return this.titleArray[this.index];
  },
  getLocationX: function () {
    return getRandomIn(this.boundaryMap.minX, this.boundaryMap.maxX);
  },
  getLocationY: function () {
    return getRandomIn(this.boundaryMap.minY, this.boundaryMap.maxY);
  },
  getPrice: function () {
    return getRandomIn(this.boundaryPrice.min, this.boundaryPrice.max);
  },
  getType: function () {
    var randomIndex = getRandomIn(0, this.typeList.length);
    return this.typeList[randomIndex];
  },
  getRooms: function () {
    return getRandomIn(this.rooms.min, this.rooms.max);
  },
  getCheckInOut: function () {
    var randomIndex = getRandomIn(0, this.timeList.length);
    return this.timeList[randomIndex];
  },
  getFeatures: function () {
    var randomLength = getRandomIn(0, this.featuresList.length);
    return shuffleArray(this.featuresList, randomLength);
  },
  getPhotos: function () {
    return shuffleArray(this.photosList, this.photosList.length);
  }
};

// Возвращает перетасованный массив заданной длинны
var shuffleArray = function (originArray, lengthNewArray) {
  var temp = [];
  for (var j = originArray.length - 1; j >= 0; j--) {
    temp[j] = originArray[j];
  }
  var range = originArray.length;
  var newArray = [];
  for (var i = 0; i < lengthNewArray; i++) {
    var randomIndex = Math.floor(Math.random() * range);
    newArray[i] = temp[randomIndex];
    range--;
    temp[randomIndex] = temp[range];
  }
  return newArray;
};

// Возврещает случайное число из диапозона
var getRandomIn = function (min, max) {
  return Math.floor((max - min) * Math.random()) + min;
};

// Заполняет структуру данных эмулированными данными пользователя
var getAnnouncement = function (dataList, index) {
  var announcement = new Announcement();
  announcement.author.avatar = 'img/avatars/user0' + (index + 1) + '.png';
  announcement.offer.title = dataList.getUniqueTitle();
  announcement.location.x = dataList.getLocationX();
  announcement.location.y = dataList.getLocationY();
  announcement.offer.address = announcement.location.x + ', '
  + announcement.location.y;
  announcement.offer.price = dataList.getPrice();
  announcement.offer.type = dataList.getType();
  announcement.offer.rooms = dataList.getRooms();
  announcement.offer.guests = getRandomIn(1, announcement.offer.rooms);
  announcement.offer.checkin = dataList.getCheckInOut();
  announcement.offer.checkout = dataList.getCheckInOut();
  announcement.offer.features = dataList.getFeatures();
  announcement.offer.photos = dataList.getPhotos();
  return announcement;
};

// Функция добавляет созданный элемент «pin» во фрагмент
var makePin = function (announcement, index) {
  var pinElement = pinAssets.template.cloneNode(true);
  pinElement.dataset.announcement = index;
  var pinImgElement = pinElement.querySelector('img');
  pinImgElement.src = announcement.author.avatar;
  pinImgElement.alt = announcement.offer.title;
  // задаем координаты галочки
  pinElement.style.left =
      (announcement.location.x - PIN_DIMENSIONS.width / 2) + 'px';
  pinElement.style.top =
      (announcement.location.y - PIN_DIMENSIONS.height) + 'px';
  pinAssets.fragment.appendChild(pinElement);
};

// Функция возвращает копию шаблона и заполняет ее
// данными от польльзователя
var fillInCard = function (templateCard, announcement) {
  var announcementCard = templateCard.cloneNode(true);
  // аватар пользователя в img .popup__avatar
  announcementCard.querySelector('.popup__avatar')
      .src = announcement.author.avatar;
  // Заголовок в .popup__title
  announcementCard.querySelector('.popup__title')
      .textContent = announcement.offer.title;
  // Адрес в .popup__text--address
  announcementCard.querySelector('.popup__text--address')
      .textContent = announcement.offer.address;
  // Цена в .popup__text--price
  announcementCard.querySelector('.popup__text--price')
      .innerHTML = parseInt(announcement.offer.price, 10)
  + '&#x20bd;<span>/ночь</span>';
  // Тип жилья in .popup__type
  announcementCard.querySelector('.popup__type')
      .textContent = typeInRussian[announcement.offer.type];
  // Кол-во комнат для кол-ва гостей .popup__text--capacity
  announcementCard.querySelector('.popup__text--capacity')
      .textContent = announcement.offer.rooms + ' комнат для '
  + announcement.offer.guests + ' гостей';
  // Время заезда и выезда в .popup__text--time
  announcementCard.querySelector('.popup__text--time')
      .textContent = 'Заезд после ' + announcement.offer.checkin + ', выезд до '
  + announcement.offer.checkout;
  // Удобства в список li .popup__feature
  var listContainer = announcementCard.querySelector('.popup__features');
  listContainer.innerHTML = '';
  for (var i = 0; i < announcement.offer.features.length; i++) {
    var listElement = document.createElement('li');
    listElement.classList.add(
        'popup__feature', 'popup__feature--' + announcement.offer.features[i]
    );
    listContainer.appendChild(listElement);
  }
  // Описание в .popup__description
  var description = announcementCard.querySelector('.popup__description');
  description.textContent = announcement.offer.description;
  // Фотографии жилья в img .popup__photo
  var imagesContainer = announcementCard.querySelector('.popup__photos');
  var imageTemplate = imagesContainer.querySelector('.popup__photo');
  imagesContainer.innerHTML = '';
  // i без var по настоянию тревиса
  for (i = 0; i < announcement.offer.photos.length; i++) {
    var image = imageTemplate.cloneNode();
    image.src = announcement.offer.photos[i];
    imagesContainer.appendChild(image);
  }
  announcementCard.querySelector('.popup__close')
      .addEventListener('click', onPopupCloseButtonClick);
  return announcementCard;
};
// Функция добавляет пины в ДОМ
var drawPinsOnMap = function () {
  bills.forEach(makePin);
  // вставить фрагмент в .map__pins
  pinAssets.container.appendChild(pinAssets.fragment);
};
var onMainPinFirstMouseup = function () {
  drawPinsOnMap();
  mapContainer.classList.remove('map--faded');
  mainPin.removeEventListener('mouseup', onMainPinFirstMouseup);
  mainPin.addEventListener('mousedown', onMainPinMousedown);
  activateAdForm();
  inputAddress.value = getNailPinPosition(mainPin.style);
  buttonReset.addEventListener('click', onResetButtonClick);
};
// Возвращает координаты острия пина
var getNailPinPosition = function (style) {
  return (parseInt(style.left, 10) + MAIN_PIN.dimansions.width / 2) + ', '
      + (parseInt(style.top, 10) + MAIN_PIN.dimansions.height);
};
// Функция отображает подробности объявления
var showAnnouncementDitails = function (announcement) {
  var cardAnnouncement = fillInCard(cardTemplate, announcement);
  // вставляем блок обьявления перед блоком .map__filters-container
  // или замещаем анологичный если таковой имеется
  var popup = mapContainer.querySelector('.map__card.popup');
  if (popup) {
    mapContainer.replaceChild(cardAnnouncement, popup);
  } else {
    mapContainer.insertBefore(cardAnnouncement, mapFiltersContainer);
    document.addEventListener('keydown', onEscKeydown);
  }
};
// функция переводит страницу в активное состояние
var activateAdForm = function () {
  formAdForm.classList.remove('ad-form--disabled');
  fieldsets.forEach(setDisabledOff);
};
// Функуия добавляет элементу атрибут disable
var setDisabledOff = function (htmlElement) {
  htmlElement.disabled = false;
};
// функция переводит страницу в не активное состояние
var inactivateAdForm = function () {
  formAdForm.classList.add('ad-form--disabled');
  fieldsets.forEach(setDisabledOn);
};
// Функуия отключает элементу атрибут disable
var setDisabledOn = function (htmlElement) {
  htmlElement.disabled = true;
};
// Закрывает окно с подробностями обьявления
var onPopupCloseButtonClick = function () {
  mapContainer.removeChild(mapContainer.querySelector('.map__card.popup'));
  document.removeEventListener('keydown', onEscKeydown);
};
// Закрывает окно с подробностями обьявления по нажатию на клавишу escape
var onEscKeydown = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onPopupCloseButtonClick();
  }
};
// Открывает окно с подробностями обьявления
var onPinClick = function (evt) {
  var pin = getPinElement(evt.target);
  if (pin) {
    showAnnouncementDitails(bills[pin.dataset.announcement]);
  }
};
// Функция возвращает пин или null если пин не найден
var getPinElement = function (element) {
  var pinElement = null;
  if (element.dataset.announcement > -1) {
    pinElement = element;
  } else if (element.parentElement.dataset.announcement > -1) {
    pinElement = element.parentElement;
  }
  return pinElement;
};
// Функция задает время выезда на основе времени заезда
var onTimeinSelectInput = function (evt) {
  selectTimeout.selectedIndex = evt.target.selectedIndex;
};
// Функция задает время заезда на основе времени выезда
var onTimeoutSelectInput = function (evt) {
  selectTimein.selectedIndex = evt.target.selectedIndex;
};
// Функция задает варианты соответствий между кол-вом комнат и гостей
var onRoomsNumberInput = function () {
  optionsCapacity.forEach(setSelectOptions);
  selectCapacity.innerHTML = '';
  selectCapacity.appendChild(optionsFragment);
  selectCapacity.selectedIndex = 0;
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
// Функция выставляет нижнюю границу цены аренды от типа строения
var onTypeSelectInput = function (evt) {
  inputRentPrice.min = minRentPrice[evt.target.value];
  inputRentPrice.placeholder = minRentPrice[evt.target.value];
};
// Функция описывает действия по клику на кнопку reset в форме
var onResetButtonClick = function () {
  fireEscKeydownEvent();
  delitePins();
  mainPinToStartPosition();
  mapContainer.classList.add('map--faded');
  mainPin.removeEventListener('mousedown', onMainPinMousedown);
  mainPin.addEventListener('mouseup', onMainPinFirstMouseup);
  setAdFormToInactive();
  inputAddress.value = getNailPinPosition(mainPin.style);
};
// Функция для перевода формы в неактивный режим
var setAdFormToInactive = function () {
  formAdForm.reset();
  buttonReset.removeEventListener('click', onResetButtonClick);
  inputTitle.removeEventListener('invalid', onInvalidFire);
  inputRentPrice.removeEventListener('invalid', onInvalidFire);
  inputTitle.classList.remove('validity');
  inputRentPrice.classList.remove('validity');
  inactivateAdForm();
};
// Функцмя удаляет пины похожих объявлений из разметки
var delitePins = function () {
  for (var i = pinAssets.container.children.length - 1; i >= 0; i--) {
    if (pinAssets.container.children[i].classList.contains('map__pin') &&
        !pinAssets.container.children[i].classList.contains('map__pin--main')) {
      pinAssets.container.removeChild(pinAssets.container.children[i]);
    }
  }
};
var mainPinToStartPosition = function () {
  mainPin.style.left = MAIN_PIN.startPosition.left + 'px';
  mainPin.style.top = MAIN_PIN.startPosition.top + 'px';
};
// Функция эмулирует нажатие клавиши ESCAPE
var fireEscKeydownEvent = function () {
  var keydownEvt = new Event('keydown');
  keydownEvt.keyCode = ESC_KEYCODE;
  document.dispatchEvent(keydownEvt);
};
var onInvalidFire = function (evt) {
  evt.target.classList.add('validity');
};
// Действия по нажатию мышкой на элементе «map__pin--main»
var onMainPinMousedown = function () {
  document.addEventListener('mousemove', onMainPinMousemove);
  document.addEventListener('mouseup', onMainPinMouseup);
  pinAssets.container.addEventListener('mouseleave',
      onPinsContainerMouseleave);
};
// Действия при отпускании клавиши мышки
// после нажания на элементе «map__pin--main»
var onMainPinMouseup = function () {
  document.removeEventListener('mousemove', onMainPinMousemove);
  document.removeEventListener('mouseup', onMainPinMouseup);
  pinAssets.container.removeEventListener('mouseleave',
      onPinsContainerMouseleave);
};
// Действия при покидании курсора мышки зоны контейнера
// после нажания на элементе «map__pin--main»
var onPinsContainerMouseleave = function () {
  document.removeEventListener('mousemove', onMainPinMousemove);
  document.removeEventListener('mouseup', onMainPinMouseup);
  pinAssets.container.removeEventListener('mouseleave',
      onPinsContainerMouseleave);
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
  positionX = getValueInRange(positionX, boundaryPinMove.minX,
      boundaryPinMove.maxX);
  var positionY = parseInt(mainPin.style.top, 10) + evt.movementY;
  positionY = getValueInRange(positionY, boundaryPinMove.minY,
      boundaryPinMove.maxY);
  mainPin.style.left = positionX + 'px';
  mainPin.style.top = positionY + 'px';
  inputAddress.value = getNailPinPosition(mainPin.style);
};

// Эмулируем массив обьявлений пользователей
var bills = [];
for (var i = 0; i < 8; i++) {
  bills[i] = getAnnouncement(announcementDataGenerator, i);
}

// получаем блок мэп
var mapContainer = document.querySelector('.map');
// Получаем шаблон из верстки
var template = document.querySelector('template').content;
// Получаем необходимые для пина элементы из верстки
var pinAssets = {
  template: template.querySelector('.map__pin'),
  container: mapContainer.querySelector('.map__pins'),
  fragment: document.createDocumentFragment()
};
// Поле ввода адреса
var inputAddress = document.querySelector('#address');
var formAdForm = document.querySelector('.ad-form');
var fieldsets = formAdForm.querySelectorAll('.ad-form fieldset');
// Получаем пин польлзователя .map__pin--main
var mainPin = mapContainer.querySelector('.map__pin--main');
// Слушатель для активации сервиса keksobooking
mainPin.addEventListener('mouseup', onMainPinFirstMouseup);

// Шаблон карточки
var cardTemplate = template.querySelector('.map__card');
// Элемент перед которым вставляется элемент card
var mapFiltersContainer = document.querySelector('.map__filters-container');
// Слушатель для показа подробностей обьявления
pinAssets.container.addEventListener('click', onPinClick);

// Будем использовать эвент для первичной синхронизации полей
var inputEvt = new Event('input');

// ТЗ 1.7 функционал для кнопки reset (line 269)
var buttonReset = formAdForm.querySelector('.ad-form__reset');

// ТЗ пункт 2.3 «Тип жилья» определяет минимальное значение поля «Цена за ночь»
var inputRentPrice = document.getElementById('price');
var selectBuildingType = document.getElementById('type');
selectBuildingType.addEventListener('input', onTypeSelectInput);
selectBuildingType.dispatchEvent(inputEvt);

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
selectRooms.dispatchEvent(inputEvt);

// ТЗ 1.4 Страница реагирует на неправильно введённые значения в форму
var inputTitle = document.getElementById('title');
inputTitle.addEventListener('invalid', onInvalidFire);
inputRentPrice.addEventListener('invalid', onInvalidFire);
