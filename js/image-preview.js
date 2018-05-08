'use strict';

(function () {
  var DEFAULT_AVATAR = 'img/muffin-grey.svg';
  var IMAGE_TYPES = ['png', 'jpeg', 'jpg', 'gif'];
  var avatarInput = document.querySelector('#avatar');
  var avatarDropZone = avatarInput.parentElement;
  var avatarViewer = avatarDropZone.parentElement.querySelector(
      '.ad-form-header__preview img');
  var photoInput = document.querySelector('#images');
  var photoDropZone = photoInput.parentElement;
  var photoContainer = photoDropZone.parentElement;
  var dragstartElement = null;
  var listForRemove = [];

  // Функция добавляет слоушатели на дроп зоны для фото и аватара
  var addListenersOnLoadZones = function () {
    avatarDropZone.addEventListener('dragover', onDropZoneDragover);
    avatarDropZone.addEventListener('drop', onDropZoneDrop);
    photoDropZone.addEventListener('dragover', onDropZoneDragover);
    photoDropZone.addEventListener('drop', onDropZoneDrop);
  };
  // Функция снимает слушатели с дроп зон для фото и аватара
  var removeListenersFromLoadZones = function () {
    avatarDropZone.removeEventListener('dragover', onDropZoneDragover);
    avatarDropZone.removeEventListener('drop', onDropZoneDrop);
    photoDropZone.removeEventListener('dragover', onDropZoneDragover);
    photoDropZone.removeEventListener('drop', onDropZoneDrop);
  };
  // Функция возвращает true если файл имеет одно из расширение «IMAGE_TYPES»
  var isImageOfTypes = function (fileName) {
    fileName = fileName.toLowerCase();
    return IMAGE_TYPES.some(function (ending) {
      return fileName.endsWith(ending);
    });
  };
  // Функция обработчик по старту собития DnD на имэдже фото-превью
  var onImageDragstart = function (evt) {
    removeListenersFromLoadZones();
    dragstartElement = evt.target;
    dragstartElement.parentElement.dataset.dragstart = true;
    dragstartElement.addEventListener('dragend', onDragendFired);
    listForRemove.forEach(function (element) {
      if (!element.dataset.dragstart) {
        element.firstChild.addEventListener('dragover', onDropZoneDragover);
        element.firstChild.addEventListener('drop', onImageDrop);
      }
    });
  };
  // Функция обработчик события прерывания DnD
  var onDragendFired = function () {
    addListenersOnLoadZones();
    listForRemove.forEach(function (element) {
      if (!element.dataset.dragstart) {
        element.firstChild.removeEventListener('dragover', onDropZoneDragover);
        element.firstChild.removeEventListener('drop', onImageDrop);
      }
    });
    dragstartElement.parentElement.dataset.dragstart = '';
    dragstartElement.removeEventListener('dragend', onDragendFired);
  };
  // Функция обработчик события drop в точке назначения
  var onImageDrop = function (evt) {
    var transferedDataUrl = dragstartElement.src;
    dragstartElement.src = evt.currentTarget.src;
    evt.currentTarget.src = transferedDataUrl;
    onDragendFired();
  };
  // Функция добавляет изображение в блок привью
  var createPhotoPreviewElement = function (dataURL) {
    var container = document.createElement('div');
    container.classList.add('ad-form__photo');
    container.style.display = 'flex';
    var imgElement = document.createElement('img');
    imgElement.src = dataURL;
    imgElement.style.margin = 'auto';
    imgElement.style.maxWidth = '100%';
    imgElement.style.maxHeight = '100%';
    imgElement.addEventListener('dragstart', onImageDragstart);
    container.appendChild(imgElement);
    listForRemove.push(container);
    photoContainer.appendChild(container);
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
  // Функция разблокирует возможность использованя события drop на элементе
  var onDropZoneDragover = function (evt) {
    evt.preventDefault();
  };
  // Функция обработчик события – «загрузка файла изображения»
  // путем перетаскивания
  var onDropZoneDrop = function (evt) {
    var file = evt.dataTransfer.files[0];
    var isAvatar = evt.currentTarget.classList.contains(
        'ad-form__field');
    if (isImageOfTypes(file.name)) {
      setDataURL(file, isAvatar);
    }
    evt.preventDefault();
  };
  // Функция активирует возможность показа загружаемого изображения
  var engage = function () {
    avatarInput.addEventListener('change', onInputFileChange);
    photoInput.addEventListener('change', onInputFileChange);
    addListenersOnLoadZones();
  };
  // Функция дезактивирует показ загружаемого изображения
  var disengage = function () {
    avatarInput.removeEventListener('change', onInputFileChange);
    photoInput.removeEventListener('change', onInputFileChange);
    removeListenersFromLoadZones();
    listForRemove.forEach(function (container) {
      photoContainer.removeChild(container);
    });
    listForRemove = [];
    avatarViewer.src = DEFAULT_AVATAR;
  };

  window.imagePreview = {
    engage: engage,
    disengage: disengage
  };
})();
