// js/utils.js
// Вспомогательные функции

const Utils = {
  // Генерация уникального ID
  generateId: function () {
    return "id_" + Math.random().toString(36).substr(2, 9);
  },

  // Форматирование даты
  formatDate: function (date, format = "DD.MM.YYYY") {
    if (!date) return "";

    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();

    if (format === "YYYY-MM-DD") {
      return `${year}-${month}-${day}`;
    }

    return `${day}.${month}.${year}`;
  },

  // Форматирование даты и времени
  formatDateTime: function (date) {
    if (!date) return "";

    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");

    return `${day}.${month}.${year} в ${hours}:${minutes}`;
  },

  // Форматирование даты для input[type="datetime-local"]
  formatDateTimeForInput: function (date) {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  },

  // Получение названия месяца
  getMonthName: function (monthIndex) {
    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];
    return months[monthIndex];
  },

  fileToBase64: function (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Создание миниатюры фото
  createThumbnail: function (file, maxWidth = 200, maxHeight = 200) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Рассчитываем размеры для миниатюры с сохранением пропорций
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Рисуем изображение с сглаживанием
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  // Проверка, является ли файл изображением
  isImageFile: function (file) {
    return file && file.type.startsWith("image/");
  },

  // Валидация размера файла (макс 5MB)
  validateFileSize: function (file, maxSizeMB = 5) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return false;
    }
    return true;
  },

  // Получение расширения файла
  getFileExtension: function (filename) {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  },

  // Проверка поддержки формата файла
  isSupportedImageFormat: function (file) {
    const supportedFormats = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    return supportedFormats.includes(file.type);
  },
};
