// js/app.js
// Основной файл приложения, инициализация и управление навигацией

document.addEventListener("DOMContentLoaded", function () {
  // Инициализация приложения
  initApp();

  // Настройка навигации
  setupNavigation();

  // Загрузка начальных данных
  loadInitialData();
});

function initApp() {
  // Инициализация всех модулей
  ClientsModule.init();
  CalendarModule.init();
  HistoryModule.init();

  // Настройка обработчиков событий для модальных окон
  setupModalHandlers();
}

function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const targetPage = this.getAttribute("data-page");

      // Убираем активный класс у всех ссылок и страниц
      navLinks.forEach((l) => l.classList.remove("active"));
      pages.forEach((p) => p.classList.remove("active"));

      // Добавляем активный класс к выбранной ссылке и странице
      this.classList.add("active");
      document.getElementById(`${targetPage}-page`).classList.add("active");

      // Загружаем данные для выбранной страницы
      loadPageData(targetPage);
    });
  });
}

function loadPageData(page) {
  switch (page) {
    case "clients":
      ClientsModule.loadClients();
      break;
    case "calendar":
      CalendarModule.renderCalendar();
      CalendarModule.loadWeeklyMeetings();
      break;
    case "history":
      HistoryModule.loadHistory();
      break;
  }
}

function setupModalHandlers() {
  // Закрытие модальных окон
  const closeButtons = document.querySelectorAll(".close-modal");
  const modalOverlay = document.getElementById("modal-overlay");

  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      ClientsModule.closeAllModals();
    });
  });

  // Закрытие по клику вне модального окна
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      ClientsModule.closeAllModals();
    }
  });
}

function loadInitialData() {
  // Загружаем данные для активной страницы
  const activePage = document
    .querySelector(".page.active")
    .id.replace("-page", "");
  loadPageData(activePage);
}
