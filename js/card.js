'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var cardTemplate = document.querySelector('template').content
      .querySelector('.map__card');
  var mapContainer = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var typeInRussian = {
    palace: 'дворец',
    flat: 'квартира',
    house: 'дом',
    bungalo: 'лачуга'
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

  window.card = {
    showAnnouncementDitails: showAnnouncementDitails,
    onPopupCloseButtonClick: onPopupCloseButtonClick
  };
})();
