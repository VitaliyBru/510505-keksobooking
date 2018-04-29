'use strict';

(function () {
  var PIN_DIMENSIONS = {
    height: 70,
    width: 50
  };
  var template = document.querySelector('template').content
      .querySelector('.map__pin');
  var fragment = document.createDocumentFragment();

  // Функция добавляет созданный элемент «pin» во фрагмент
  var makePin = function (announcement, index) {
    var pinElement = template.cloneNode(true);
    pinElement.dataset.announcement = index;
    var pinImgElement = pinElement.querySelector('img');
    pinImgElement.src = announcement.author.avatar;
    pinImgElement.alt = announcement.offer.title;
    // задаем координаты галочки
    pinElement.style.left =
        (announcement.location.x - PIN_DIMENSIONS.width / 2) + 'px';
    pinElement.style.top =
        (announcement.location.y - PIN_DIMENSIONS.height) + 'px';
    fragment.appendChild(pinElement);
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
      window.card.showAnnouncementDitails(
          window.data.bills[pin.dataset.announcement]);
    }
  };
  var container = document.querySelector('.map__pins');
  container.addEventListener('click', onPinClick);

  window.pin = {
    pinsContainer: container,
    // Функция добавляет пины в ДОМ
    drawPinsOnMap: function () {
      window.data.bills.forEach(makePin);
      container.appendChild(fragment);
    },
    // Функцмя удаляет пины похожих объявлений из разметки
    delitePins: function () {
      var children = container.querySelectorAll('.map__pin:not(.map__pin--main)');
      children.forEach(function (child) {
        container.removeChild(child);
      });
    }
  };
})();
