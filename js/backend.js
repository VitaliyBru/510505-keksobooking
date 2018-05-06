'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var TEN_SECONDS = 10000;
  var APIUrl = {
    PULL_DATA: 'https://js.dump.academy/keksobooking/data',
    PUSH_DATA: 'https://js.dump.academy/keksobooking'
  };
  // Функция содержит общую часть кода для «downloadData» и «uploadData»
  var preSetXhr = function (onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Нет ответа от сервера.');
    });
    xhr.timeout = TEN_SECONDS;
    return xhr;
  };
  // Функция для получения данных с сервера
  var downloadData = function (onLoad, onError) {
    var xhr = preSetXhr(onError);
    xhr.open('GET', APIUrl.PULL_DATA);
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Код ответа сервера: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.send();
  };
  // Функция для отправки данных формы на сервер
  var uploadData = function (data, onLoad, onError) {
    var xhr = preSetXhr(onError);
    xhr.open('POST', APIUrl.PUSH_DATA);
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad();
      } else {
        onError('Ошибка код: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.send(data);
  };

  window.backend = {
    load: downloadData,
    send: uploadData
  };
})();
