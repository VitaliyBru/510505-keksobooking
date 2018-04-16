'use strict';

var PIN_DIMENSIONS = {
  height: 70,
  width: 50
};
var MAIN_PIN_DIMENSIONS = {
  height: 80,
  width: 64
};
var TYPE_IN_RUSSIAN = {
  palace: 'дворец',
  flat: 'квартира',
  house: 'дом',
  bungalo: 'лачуга'
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

// Функция возвращает созданный элемент «pin»
var makePin = function (templatePin, announcement) {
  var pinElement = templatePin.cloneNode(true);
  var pinImgElement = pinElement.querySelector('img');
  pinImgElement.setAttribute('src', announcement.author.avatar);
  pinImgElement.setAttribute('alt', announcement.offer.title);
  // задаем координаты галочки
  pinElement.style.left = (announcement.location.x - PIN_DIMENSIONS.width / 2) + 'px';
  pinElement.style.top = (announcement.location.y - PIN_DIMENSIONS.height) + 'px';
  return pinElement;
};

// Функция возвращает копию шаблона и заполняет ее
// данными от польльзователя
var fillInCard = function (templateCard, announcement) {
  var announcementCard = templateCard.cloneNode(true);
  // аватар пользователя в img .popup__avatar
  announcementCard.querySelector('.popup__avatar')
      .setAttribute('src', announcement.author.avatar);
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
      .textContent = TYPE_IN_RUSSIAN[announcement.offer.type];
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
    image.setAttribute('src', announcement.offer.photos[i]);
    imagesContainer.appendChild(image);
  }
  announcementCard.querySelector('.popup__close')
      .addEventListener('click',
          function () {
            mapContainer.removeChild(
                mapContainer.querySelector('.map__card.popup')
            );
          }
      );
  return announcementCard;
};
// Функция добавляет пины в ДОМ
var drawPinsOnMap = function () {
  for (var i = 0; i < bills.length; i++) {
    var pin = makePin(pinTemplate, bills[i]);
    pin.dataset.announcement = i;
    // Наполняем фрагмент пинами
    pinFragment.appendChild(pin);
  }
  // вставить фрагмент в .map__pins
  document.querySelector('.map__pins').appendChild(pinFragment);
};
var onMainPinFirstMouseup = function () {
  drawPinsOnMap();
  mapContainer.classList.remove('map--faded');
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  mainPin.removeEventListener('mouseup', onMainPinFirstMouseup);
  inputAddress.value = getNailPinPosition(mainPin.style);
};
// Возвращает координаты острия пина
var getNailPinPosition = function (style) {
  return (parseInt(style.left, 10) + MAIN_PIN_DIMENSIONS.width / 2) + ', '
      + (parseInt(style.top, 10) + MAIN_PIN_DIMENSIONS.height);
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
    mapContainer.insertBefore(
        cardAnnouncement,
        document.querySelector('.map__filters-container')
    );
  }
};
var onPinClick = function (evt) {
  var pin = getPinElement(evt.target);
  if (pin) {
    showAnnouncementDitails(bills[pin.dataset.announcement]);
  }
};
// Функция возвращает пин или null если пин не найден
var getPinElement = function (element) {
  var pinElement = null;
  if (element.className === 'map__pin') {
    pinElement = element;
  } else if (element.parentElement.className === 'map__pin') {
    pinElement = element.parentElement;
  }
  return pinElement;
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
// получить темплайт пина
var pinTemplate = template.querySelector('.map__pin');
// Создаем фрагмент
var pinFragment = document.createDocumentFragment();
// Поле ввода адреса
var inputAddress = document.querySelector('#address');
// Получаем пин польлзователя .map__pin--main
var mainPin = mapContainer.querySelector('.map__pin--main');
mainPin.addEventListener('mouseup', onMainPinFirstMouseup);


// Шаблон карточки
var cardTemplate = template.querySelector('.map__card');
mapContainer.querySelector('.map__pins').addEventListener('click', onPinClick);
