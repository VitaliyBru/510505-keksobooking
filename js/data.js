'use strict';

(function () {
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

  // Эмулируем массив обьявлений пользователей
  var bills = [];
  for (var i = 0; i < 8; i++) {
    bills[i] = getAnnouncement(announcementDataGenerator, i);
  }
  window.data = {
    bills: bills
  };
})();
