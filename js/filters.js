'use strict';

(function () {
  var BITE = 255;
  var VISIBLE_PINS_QUANTITY = 5;
  var BitMask = {
    TIPE: 1,
    PRICE: 2,
    ROOMS: 4,
    GUESTS: 8,
    FEATURES: 16
  }
  var PriceLimit = {
    LOW: 10000,
    MIDDLE: 50000
  }
  var pins = [];
  var bills = {};
  var value = null;
  var visiblePins = null;
  var form = document.querySelector('.map__filters');
  var featuresField = document.getElementById('housing-features');
  // Функция скрывает или показывает пины обьявлений на основании
  // выставленных фильтров
  var pinsHidder = function (testValue, bitMask, _index ) {
    var isHide = (testValue === value || value === 'any');
    var mask = parseInt(pins[_index].dataset.filtersMask, 10);
    mask = isHide ? mask & (BITE - bitMask) : mask | bitMask;
    pins[_index].dataset.filtersMask = mask;
    if (mask || visiblePins <= 0) {
      pins[_index].classList.add('hidden');
    } else {
      visiblePins--;
      pins[_index].classList.remove('hidden');
    }
  };
  // Фильтрация по типу жилья
  var onHouseType = function (annoucement, index) {
    pinsHidder(annoucement.offer.type, BitMask.TIPE, index);
  };
  // Фильтрация по цене за ночь
  var onHousePrice = function (annoucement, index) {
    var price = 'high';
    if (annoucement.offer.price < PriceLimit.LOW) {
      price = 'low';
    } else if (annoucement.offer.price <= PriceLimit.MIDDLE) {
      price = 'middle';
    }
    pinsHidder(price, BitMask.PRICE, index);
  };
  // Фильтрация по колличеству комнат
  var onHouseRooms = function (annoucement, index) {
    pinsHidder(annoucement.offer.rooms.toString(), BitMask.ROOMS, index);
  };
  // Фильтрация по колличеству гостей
  var onHouseGuests = function (annoucement, index) {
    pinsHidder(annoucement.offer.guests.toString(), BitMask.GUESTS, index);
  };
  // Словарь функций для фильтрации
  var filtersMap = {
    'housing-type': function () {
      bills.forEach(onHouseType);
    },
    'housing-price': function () {
      bills.forEach(onHousePrice);
    },
    'housing-rooms': function () {
      bills.forEach(onHouseRooms);
    },
    'housing-guests': function () {
      bills.forEach(onHouseGuests);
    }
  };
  var onFilterChange = function (evt) {
    value = evt.target.value;
    visiblePins = VISIBLE_PINS_QUANTITY;
    window.commonParts.fireEscKeydownEvent();
    filtersMap[evt.target.name]();
  };
  var onFilterFeaturesClick = function (evt) {
    if (evt.target.localName === 'input') {
      visiblePins = VISIBLE_PINS_QUANTITY;
      window.commonParts.fireEscKeydownEvent();
      var data = new FormData(form);
      var list = data.getAll('features');
      bills.forEach(function (annoucement, index) {
        var isVisible = true;
        list.forEach(function (feature) {
          isVisible &= annoucement.offer.features.includes(feature);
        });
        value = isVisible ? 'visible' : 'hidden';
        pinsHidder('visible', BitMask.FEATURES, index);
      });
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
