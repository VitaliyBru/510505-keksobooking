'use strict';

(function () {
  var BITE = 255;
  var VISIBLE_PINS_QUANTITY = 5;
  var TIMEOUT_DURATION = 500;
  var FILTER_NOT_CHOSEN = 'any';
  var PinState = {
    VISIBLE: 1,
    HIDDEN: 0
  };
  var BitMask = {
    TIPE: 1,
    PRICE: 2,
    ROOMS: 4,
    GUESTS: 8,
    FEATURES: 16
  };
  var PriceLimit = {
    LOW: 10000,
    MIDDLE: 50000
  };
  var PriceCategory = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };
  var pins = [];
  var bills = {};
  var value = null;
  var visiblePins = null;
  var idTimeout = null;
  var form = document.querySelector('.map__filters');
  var featuresField = document.querySelector('#housing-features');
  // Функция скрывает или показывает пины обьявлений на основании
  // выставленных фильтров
  var pinsHidder = function (testValue, bitMask, index) {
    var isVisible = (testValue === value || value === FILTER_NOT_CHOSEN);
    var mask = parseInt(pins[index].dataset.filtersMask, 10);
    mask = isVisible ? mask & (BITE - bitMask) : mask | bitMask;
    pins[index].dataset.filtersMask = mask;
    if (mask || visiblePins <= 0) {
      pins[index].classList.add('hidden');
    } else {
      visiblePins--;
      pins[index].classList.remove('hidden');
    }
  };
  // Фильтрация по типу жилья
  var compareHouseType = function (annoucement, index) {
    pinsHidder(annoucement.offer.type, BitMask.TIPE, index);
  };
  // Фильтрация по цене за ночь
  var compareHousePrice = function (annoucement, index) {
    var price = PriceCategory.HIGH;
    if (annoucement.offer.price < PriceLimit.LOW) {
      price = PriceCategory.LOW;
    } else if (annoucement.offer.price <= PriceLimit.MIDDLE) {
      price = PriceCategory.MIDDLE;
    }
    pinsHidder(price, BitMask.PRICE, index);
  };
  // Фильтрация по колличеству комнат
  var compareHouseRooms = function (annoucement, index) {
    pinsHidder(annoucement.offer.rooms.toString(), BitMask.ROOMS, index);
  };
  // Фильтрация по колличеству гостей
  var compareHouseGuests = function (annoucement, index) {
    pinsHidder(annoucement.offer.guests.toString(), BitMask.GUESTS, index);
  };
  // Словарь функций для фильтрации
  var filtersMap = {
    'housing-type': function () {
      bills.forEach(compareHouseType);
    },
    'housing-price': function () {
      bills.forEach(compareHousePrice);
    },
    'housing-rooms': function () {
      bills.forEach(compareHouseRooms);
    },
    'housing-guests': function () {
      bills.forEach(compareHouseGuests);
    }
  };
  // Функция фильтрует объявления по наличию дополнительных опций
  var showPinsWithFeatures = function () {
    visiblePins = VISIBLE_PINS_QUANTITY;
    var data = new FormData(form);
    var list = data.getAll('features');
    bills.forEach(function (annoucement, index) {
      var isVisible = true;
      list.forEach(function (feature) {
        isVisible &= annoucement.offer.features.includes(feature);
      });
      value = isVisible ? PinState.VISIBLE : PinState.HIDDEN;
      pinsHidder(PinState.VISIBLE, BitMask.FEATURES, index);
    });
    window.commonParts.fireEscKeydownEvent();
    idTimeout = null;
  };
  // Функция фильтрует объявления по данным из блоков «select»
  var onFilterChange = function (evt) {
    value = evt.target.value;
    visiblePins = VISIBLE_PINS_QUANTITY;
    window.commonParts.fireEscKeydownEvent();
    filtersMap[evt.target.name]();
  };
  // Функция обрабатывает клики по дополнительным опциям
  var onFilterFeaturesClick = function (evt) {
    if (evt.target.localName === 'input') {
      if (idTimeout) {
        clearTimeout(idTimeout);
      }
      idTimeout = setTimeout(showPinsWithFeatures, TIMEOUT_DURATION);
    }
  };
  // Функция активирует алгоритм фильтрации
  var engageFilters = function () {
    pins = window.pin.getPinElArray();
    bills = window.pin.getBills();
    form.addEventListener('input', onFilterChange);
    featuresField.addEventListener('click', onFilterFeaturesClick);
  };
  // Функция дезактивирует алгоритм фильтрации
  var disengageFilters = function () {
    form.reset();
    if (pins) {
      form.removeEventListener('input', onFilterChange);
      featuresField.removeEventListener('click', onFilterFeaturesClick);
    }
  };

  window.filters = {
    engageFilters: engageFilters,
    disengageFilters: disengageFilters
  };
})();
