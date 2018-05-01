'use strict';

(function () {
  var Url = {
    PULL_DATA: 'https://js.dump.academy/keksobooking/data',
    PUSH_DATA: 'https://js.dump.academy/keksobooking'
  };
  var TEN_SECONDS = 10000;
  // Функция для получения данных с сервера
  var downloadData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', Url.PULL_DATA);
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Код ответа сервера: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Нет ответа от сервера.');
    });
    xhr.timeout = TEN_SECONDS;
    xhr.send();
  };
  // Функция для отправки данных формы на сервер
  var uploadData = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', Url.PUSH_DATA);
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad();
      } else {
        onError('Ошибка код: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Нет ответа от сервера.');
    });
    xhr.send(data);
  };

  window.backend = {
    load: downloadData,
    send: uploadData
  };
})();
