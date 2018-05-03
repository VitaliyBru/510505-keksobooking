'use strict';

(function () {
  var Url = {
    PULL_DATA: 'https://js.dump.academy/keksobooking/data',
    PUSH_DATA: 'https://js.dump.academy/keksobooking'
  };
  var SUCCESS_CODE = 200;
  var TEN_SECONDS = 10000;
  // Функция содержит общую часть кода для «downloadData» и «uploadData»
  var preSetXhr = function (_onError) {
    var _xhr = new XMLHttpRequest();
    _xhr.responseType = 'json';
    _xhr.addEventListener('error', function () {
      _onError('Ошибка соединения');
    });
    _xhr.addEventListener('timeout', function () {
      _onError('Нет ответа от сервера.');
    });
    _xhr.timeout = TEN_SECONDS;
    return _xhr;
  };
  // Функция для получения данных с сервера
  var downloadData = function (onLoad, onError) {
    var xhr = preSetXhr(onError);
    xhr.open('GET', Url.PULL_DATA);
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
    xhr.open('POST', Url.PUSH_DATA);
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
