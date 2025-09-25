// js/history.js
// Модуль истории действий

const HistoryModule = {
  init: function () {
    this.setupEventListeners();
  },

  setupEventListeners: function () {
    // Экспорт в Excel
    document.getElementById("export-excel").addEventListener("click", () => {
      this.exportToExcel();
    });

    // Очистка всех данных
    document.getElementById("clear-all-data").addEventListener("click", () => {
      this.clearAllData();
    });
  },

  loadHistory: function () {
    const history = StorageModule.getHistory();
    const historyList = document.getElementById("history-list");
    const emptyMessage = document.getElementById("empty-history-message");

    if (history.length === 0) {
      historyList.innerHTML = "";
      emptyMessage.classList.add("active");
      return;
    }

    emptyMessage.classList.remove("active");

    // Сортируем историю по дате (новые сверху)
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    historyList.innerHTML = history
      .map(
        (item) => `
            <div class="history-item">
                <div class="history-header">
                    <strong>${item.action}</strong>
                    <span class="history-date">${Utils.formatDateTime(
                      item.timestamp
                    )}</span>
                </div>
                <div class="history-details">${item.details}</div>
            </div>
        `
      )
      .join("");
  },

  addAction: function (action, details) {
    const historyItem = {
      id: Utils.generateId(),
      action: action,
      details: details,
      timestamp: new Date().toISOString(),
    };

    StorageModule.addHistoryItem(historyItem);

    // Если открыта страница истории, обновляем её
    if (document.getElementById("history-page").classList.contains("active")) {
      this.loadHistory();
    }
  },

  exportToExcel: function () {
    const history = StorageModule.getHistory();

    if (history.length === 0) {
      alert("Нет данных для экспорта.");
      return;
    }

    // В реальном приложении здесь был бы экспорт в Excel
    // Для демонстрации просто покажем данные в alert
    let excelData = "Действие;Дата;Детали\n";
    history.forEach((item) => {
      excelData += `${item.action};${Utils.formatDateTime(item.timestamp)};${
        item.details
      }\n`;
    });

    // Создаем и скачиваем файл
    const blob = new Blob([excelData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `realtor_history_${Utils.formatDate(new Date(), "YYYY-MM-DD")}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.addAction(
      "Экспорт данных",
      "Данные истории были экспортированы в CSV"
    );
  },

  clearAllData: function () {
    if (
      confirm(
        "Вы уверены, что хотите удалить все данные? Это действие нельзя отменить."
      )
    ) {
      StorageModule.clearAllData();
      this.addAction("Очистка данных", "Все данные приложения были удалены");
      this.loadHistory();

      // Перезагружаем данные на других страницах
      if (
        document.getElementById("clients-page").classList.contains("active")
      ) {
        ClientsModule.loadClients();
      }

      if (
        document.getElementById("calendar-page").classList.contains("active")
      ) {
        CalendarModule.renderCalendar();
        CalendarModule.loadWeeklyMeetings();
      }
    }
  },
};
