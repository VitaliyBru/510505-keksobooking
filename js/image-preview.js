'use strict';

(function () {
  var IMAGE_TYPES = ['png', 'jpeg', 'jpg', 'gif'];
  var avatarLoader = document.getElementById('avatar');
  var avatarViewer = document.querySelector('.ad-form-header__preview img');
  var DEFAULT_AVATAR = avatarViewer.src;
  var photoLoader = document.getElementById('images');
  var photoContainer = document.querySelector('.ad-form__photo');
  var listForRemove = [];

  // Функция возвращает true если файл имеет одно из расширение «IMAGE_TYPES»
  var isImageOfTypes = function (fileName) {
    fileName = fileName.toLowerCase();
    return IMAGE_TYPES.some(function (ending) {
      return fileName.endsWith(ending);
    });
  };
  // Функция добавляет изображение в блок привью
  var createPhotoPreviewElement = function (dataURL) {
    var imgElement = document.createElement('img');
    imgElement.src = dataURL;
    listForRemove.push(imgElement);
    photoContainer.appendChild(imgElement);
  };
  // Функция присваивает dataURL соответствующим элементам
  var setDataURL = function (file, isAvatar) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      if (isAvatar) {
        avatarViewer.src = reader.result;
      } else {
        createPhotoPreviewElement(reader.result);
      }
    });
    reader.readAsDataURL(file);
  };
  // Функция обработчик события – «загрузка файла изображения»
  var onInputFileChange = function (evt) {
    if (!evt.currentTarget.files.length) {
      return;
    }
    var isAvatar = evt.currentTarget.id === 'avatar';
    var file = evt.currentTarget.files[0];
    if (isImageOfTypes(file.name)) {
      setDataURL(file, isAvatar);
    }
  };
  // Функция активирует возможность показа загружаемого изображения
  var engage = function () {
    avatarLoader.addEventListener('change', onInputFileChange);
    photoLoader.addEventListener('change', onInputFileChange);
  };
  // Функция дезактивирует показ загружаемого изображения
  var disengage = function () {
    avatarLoader.removeEventListener('change', onInputFileChange);
    photoLoader.addEventListener('change', onInputFileChange);
    listForRemove.forEach(function (imgElement) {
      photoContainer.removeChild(imgElement);
    });
    listForRemove = [];
    avatarViewer.src = DEFAULT_AVATAR;
  };

  window.imagePreview = {
    engage: engage,
    disengage: disengage
  };
})();
