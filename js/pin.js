'use strict';

(function () {
  var PIN_INDEX_LIMIT = 4;
  var PIN_DIMENSIONS = {
    height: 70,
    width: 50
  };
  var template = document.querySelector('template').content
      .querySelector('.map__pin');
  var fragment = document.createDocumentFragment();
  var pinsContainer = document.querySelector('.map__pins');
  var pinElArray = [];
  var bills = {};

  // Функция добавляет созданный элемент «pin» во фрагмент
  var makePin = function (announcement, index) {
    var pinElement = template.cloneNode(true);
    pinElement.dataset.announcement = index;
    pinElement.dataset.filtersMask = 0;
    if (index > PIN_INDEX_LIMIT) {
      pinElement.classList.add('hidden');
    }
    var pinImgElement = pinElement.querySelector('img');
    pinImgElement.src = announcement.author.avatar;
    pinImgElement.alt = announcement.offer.title;
    // задаем координаты галочки
    pinElement.style.left =
        (announcement.location.x - PIN_DIMENSIONS.width / 2) + 'px';
    pinElement.style.top =
        (announcement.location.y - PIN_DIMENSIONS.height) + 'px';
    fragment.appendChild(pinElement);
    pinElArray.push(pinElement);
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
  // Открывает окно с подробностями обьявления
  var onPinClick = function (evt) {
    var pin = getPinElement(evt.target);
    if (pin) {
      window.card.showAnnouncementDitails(bills[pin.dataset.announcement]);
    }
  };
  // Функция сохраняет полученные данные в переменной и добавляет пины в ДОМ
  var onSucceedDownload = function (recivedData) {
    bills = recivedData;
    bills.forEach(makePin);
    pinsContainer.appendChild(fragment);
    pinsContainer.addEventListener('click', onPinClick);
    window.filters.engageFilters();
  };
  var showSimilarPin = function () {
    window.backend.load(onSucceedDownload, window.errorMessage.onError);
  };
  // Функцмя удаляет пины похожих объявлений из разметки
  var delitePins = function () {
    pinElArray.forEach(function (child) {
      pinsContainer.removeChild(child);
    });
    pinsContainer.removeEventListener('click', onPinClick);
    pinElArray = [];
  };
  // Функция позволяет получить доступ к объекту за пределами модуля
  var getBills = function () {
    return bills;
  };
  // Функция возвращает массив пин-элементов
  var getPinElArray = function () {
    return pinElArray;
  };

  window.pin = {
    pinsContainer: pinsContainer,
    getPinElArray: getPinElArray,
    getBills: getBills,
    showSimilarPin: showSimilarPin,
    delitePins: delitePins
  };
})();
