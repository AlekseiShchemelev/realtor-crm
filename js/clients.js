// js/clients.js - ПОЛНАЯ ВЕРСИЯ С ПОДДЕРЖКОЙ ФОТО
const ClientsModule = {
  clients: [],
  currentEditingId: null,
  currentPhotoFile: null,

  init: function () {
    this.setupEventListeners();
    this.setupKeyboardHandlers();
    this.loadClients();

    // Обработчик изменения размера окна
    window.addEventListener("resize", () => {
      this.loadClients();
    });
  },

  // Новый метод для обработки клавиатуры
  setupKeyboardHandlers: function () {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllModals();
      }
    });
  },

  setupEventListeners: function () {
    document.getElementById("add-client-btn").addEventListener("click", () => {
      this.openClientModal();
    });

    document.getElementById("save-client").addEventListener("click", () => {
      this.saveClient();
    });

    document.getElementById("client-search").addEventListener("input", (e) => {
      this.filterClients(e.target.value);
    });

    document.getElementById("select-all").addEventListener("change", (e) => {
      this.toggleSelectAll(e.target.checked);
    });

    // Обработчики закрытия модальных окон
    document.querySelectorAll(".close-modal").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.closeAllModals();
      });
    });

    // Закрытие по клику на оверлей
    document.getElementById("modal-overlay").addEventListener("click", (e) => {
      if (e.target.id === "modal-overlay") {
        this.closeAllModals();
      }
    });
  },

  loadClients: function () {
    this.clients = StorageModule.getClients();
    this.renderClients();
  },

  renderClients: function () {
    const clientsList = document.getElementById("clients-list");
    const emptyMessage = document.getElementById("empty-clients-message");

    if (this.clients.length === 0) {
      clientsList.innerHTML = "";
      emptyMessage.classList.add("active");
      return;
    }

    emptyMessage.classList.remove("active");

    // Проверяем ширину экрана
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      this.renderMobileCards();
    } else {
      this.renderDesktopTable();
    }

    this.addClientActionHandlers();
    this.setupPhotoClickHandlers();
  },

  renderDesktopTable: function () {
    // Показываем таблицу
    const clientsTable = document.querySelector(".clients-table");
    if (clientsTable) clientsTable.style.display = "table";

    // Скрываем карточки
    const cardsContainer = document.getElementById("clients-cards");
    if (cardsContainer) cardsContainer.style.display = "none";

    const clientsList = document.getElementById("clients-list");
    clientsList.innerHTML = this.clients
      .map(
        (client) => `
        <tr>
          <td><input type="checkbox" class="client-checkbox" data-id="${
            client.id
          }"></td>
          <td>
            <img src="${client.photo || this.getDefaultPhoto()}" 
                alt="Фото ${client.name}" 
                class="client-photo"
                onerror="this.src='${this.getDefaultPhoto()}'">
          </td>
          <td>${client.name}</td>
          <td>${client.phone}</td>
          <td>${client.address}</td>
          <td>${
            client.meetingDate
              ? Utils.formatDate(client.meetingDate)
              : "Не назначена"
          }</td>
          <td>
            <button class="btn-secondary view-client" data-id="${
              client.id
            }">Просмотр</button>
            <button class="btn-secondary edit-client" data-id="${
              client.id
            }">Изменить</button>
          </td>
        </tr>
      `
      )
      .join("");
  },

  renderMobileCards: function () {
    // Скрываем таблицу
    const clientsTable = document.querySelector(".clients-table");
    if (clientsTable) clientsTable.style.display = "none";

    // Показываем контейнер карточек
    let cardsContainer = document.getElementById("clients-cards");
    if (!cardsContainer) {
      cardsContainer = document.createElement("div");
      cardsContainer.id = "clients-cards";
      cardsContainer.className = "clients-cards";
      document
        .querySelector(".clients-table-container")
        .appendChild(cardsContainer);
    }

    cardsContainer.style.display = "block";

    // Очищаем и заполняем карточки
    cardsContainer.innerHTML = this.clients
      .map(
        (client) => `
        <div class="client-card">
          <div class="client-card-header">
            <img src="${client.photo || this.getDefaultPhoto()}" 
                alt="Фото ${client.name}" 
                class="client-photo"
                onerror="this.src='${this.getDefaultPhoto()}'">
            <div class="client-card-info">
              <h4>${client.name}</h4>
              <span>${client.phone}</span>
            </div>
          </div>
          <div class="client-card-details">
            <div class="client-card-detail">
              <strong>Адрес:</strong>
              <span>${client.address || "Не указан"}</span>
            </div>
            <div class="client-card-detail">
              <strong>Встреча:</strong>
              <span>${
                client.meetingDate
                  ? Utils.formatDate(client.meetingDate)
                  : "Не назначена"
              }</span>
            </div>
          </div>
          <div class="client-card-actions">
            <button class="btn-secondary view-client" data-id="${
              client.id
            }">Просмотр</button>
            <button class="btn-secondary edit-client" data-id="${
              client.id
            }">Изменить</button>
          </div>
        </div>
      `
      )
      .join("");
  },

  getDefaultPhoto: function () {
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNlMWUxZTEiLz4KPHBhdGggZD0iTTIwIDIyQzIyLjIwOTEgMjIgMjQgMjAuMjA5MSAyNCAxOEMyNCAxNS43OTA5IDIyLjIwOTEgMTQgMjAgMTRDMTcuNzkwOSAxNCAxNiAxNS43OTA5IDE2IDE4QzE2IDIwLjIwOTEgMTcuNzkwOSAyMiAyMCAyMloiIGZpbGw9IiM5OTk5OTkiLz4KPHBhdGggZD0iTTE1IDI2QzE1IDI0LjM0NzggMTYuMzQ3OCAyMyAxOCAyM0gyMkMyMy42NTIyIDIzIDI1IDI0LjM0NzggMjUgMjZWMjhIMTVWMjZaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo=";
  },

  addClientActionHandlers: function () {
    const self = this;

    document.querySelectorAll(".view-client").forEach((button) => {
      button.addEventListener("click", function () {
        const clientId = this.getAttribute("data-id");
        self.viewClient(clientId);
      });
    });

    document.querySelectorAll(".edit-client").forEach((button) => {
      button.addEventListener("click", function () {
        const clientId = this.getAttribute("data-id");
        self.editClient(clientId);
      });
    });
  },

  openClientModal: function (client = null) {
    this.closeAllModals();
    this.currentPhotoFile = null;

    const modalTitle = document.getElementById("client-modal-title");
    const form = document.getElementById("client-form");

    if (client) {
      modalTitle.textContent = "Редактировать клиента";
      document.getElementById("client-name").value = client.name;
      document.getElementById("client-phone").value = client.phone;
      document.getElementById("client-address").value = client.address;
      document.getElementById("meeting-date").value = client.meetingDate
        ? Utils.formatDateTimeForInput(client.meetingDate)
        : "";

      this.setClientPhotoPreview(client.photo);
      this.currentEditingId = client.id;
    } else {
      modalTitle.textContent = "Добавить клиента";
      form.reset();
      this.setClientPhotoPreview(null);
      this.currentEditingId = null;
    }

    this.setupPhotoUploadHandler();
    document.getElementById("client-modal").style.display = "block";
    document.getElementById("modal-overlay").classList.add("active");
  },

  setupPhotoUploadHandler: function () {
    const photoInput = document.getElementById("client-photo");
    const removePhotoBtn = document.getElementById("remove-client-photo");

    if (photoInput) {
      photoInput.onchange = (e) => {
        const file = e.target.files[0];
        this.handlePhotoSelection(file);
      };
    }

    if (removePhotoBtn) {
      removePhotoBtn.onclick = () => {
        this.removeClientPhoto();
      };
    }
  },

  handlePhotoSelection: function (file) {
    if (!file) return;

    if (!Utils.isImageFile(file)) {
      alert("Пожалуйста, выберите файл изображения (JPEG, PNG, GIF)");
      return;
    }

    if (!Utils.isSupportedImageFormat(file)) {
      alert("Пожалуйста, выберите изображение в формате JPEG, PNG или GIF");
      return;
    }

    if (!Utils.validateFileSize(file)) {
      alert("Размер файла не должен превышать 5MB");
      return;
    }

    this.currentPhotoFile = file;
    this.showPhotoPreview(file);
  },

  showPhotoPreview: function (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const defaultPhoto = document.getElementById("default-client-photo");
      const customPhoto = document.getElementById("custom-client-photo");
      const removeBtn = document.getElementById("remove-client-photo");

      if (defaultPhoto) defaultPhoto.style.display = "none";
      if (customPhoto) {
        customPhoto.src = e.target.result;
        customPhoto.style.display = "block";
      }
      if (removeBtn) removeBtn.style.display = "block";
    };
    reader.readAsDataURL(file);
  },

  setClientPhotoPreview: function (photoData) {
    const defaultPhoto = document.getElementById("default-client-photo");
    const customPhoto = document.getElementById("custom-client-photo");
    const removeBtn = document.getElementById("remove-client-photo");
    const photoInput = document.getElementById("client-photo");

    if (photoData) {
      if (defaultPhoto) defaultPhoto.style.display = "none";
      if (customPhoto) {
        customPhoto.src = photoData;
        customPhoto.style.display = "block";
      }
      if (removeBtn) removeBtn.style.display = "block";
    } else {
      if (defaultPhoto) defaultPhoto.style.display = "block";
      if (customPhoto) customPhoto.style.display = "none";
      if (removeBtn) removeBtn.style.display = "none";
    }

    if (photoInput) photoInput.value = "";
  },

  removeClientPhoto: function () {
    this.currentPhotoFile = null;
    this.setClientPhotoPreview(null);
  },

  editClient: function (clientId) {
    const client = this.clients.find((c) => c.id === clientId);
    if (client) {
      this.openClientModal(client);
    }
  },

  viewClient: function (clientId) {
    this.closeAllModals();

    const client = this.clients.find((c) => c.id === clientId);
    if (!client) return;

    document.getElementById("client-details-name").textContent = client.name;
    document.getElementById("details-client-phone").textContent = client.phone;
    document.getElementById("details-client-address").textContent =
      client.address;
    document.getElementById("details-meeting-date").textContent =
      client.meetingDate
        ? Utils.formatDateTime(client.meetingDate)
        : "Не назначена";

    const photoElement = document.getElementById("details-client-photo");
    photoElement.src = client.photo || this.getDefaultPhoto();
    photoElement.alt = `Фото ${client.name}`;
    photoElement.onerror = function () {
      this.src = ClientsModule.getDefaultPhoto();
    };

    this.setupClientDetailsHandlers(clientId);

    // Добавляем обработчик клика по фото после отображения модального окна
    setTimeout(() => {
      this.setupPhotoClickHandlers();
    }, 100);

    document.getElementById("client-details-modal").style.display = "block";
    document.getElementById("modal-overlay").classList.add("active");
  },

  closeAllModals: function () {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
    document.getElementById("modal-overlay").classList.remove("active");
  },

  setupClientDetailsHandlers: function (clientId) {
    const self = this;

    document.getElementById("edit-client-btn").onclick = function () {
      const client = self.clients.find((c) => c.id === clientId);
      if (client) {
        self.closeAllModals();
        setTimeout(() => self.openClientModal(client), 100);
      }
    };

    document.getElementById("show-on-map").onclick = function () {
      const client = self.clients.find((c) => c.id === clientId);
      if (client && client.address) {
        const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(
          client.address
        )}`;
        window.open(mapUrl, "_blank");
      }
    };

    document.getElementById("meeting-completed").onclick = function () {
      self.markMeetingCompleted(clientId);
    };

    document.getElementById("meeting-cancelled").onclick = function () {
      self.cancelMeeting(clientId);
    };

    document.getElementById("delete-client-btn").onclick = function () {
      if (confirm("Вы уверены, что хотите удалить этого клиента?")) {
        self.deleteClient(clientId);
      }
    };
  },

  saveClient: function () {
    const clientData = {
      name: document.getElementById("client-name").value.trim(),
      phone: document.getElementById("client-phone").value.trim(),
      address: document.getElementById("client-address").value.trim(),
      meetingDate: document.getElementById("meeting-date").value
        ? new Date(document.getElementById("meeting-date").value)
        : null,
    };

    if (!clientData.name || !clientData.phone) {
      alert("Пожалуйста, заполните обязательные поля: ФИО и Телефон");
      return;
    }

    const saveWithPhoto = async () => {
      try {
        if (this.currentPhotoFile) {
          // Создаем миниатюру для фото
          clientData.photo = await Utils.createThumbnail(
            this.currentPhotoFile,
            200,
            200
          );
        } else if (this.currentEditingId) {
          // При редактировании сохраняем старое фото, если новое не выбрано
          const existingClient = this.clients.find(
            (c) => c.id === this.currentEditingId
          );
          if (existingClient && existingClient.photo) {
            clientData.photo = existingClient.photo;
          }
        }

        if (this.currentEditingId) {
          clientData.id = this.currentEditingId;
          StorageModule.updateClient(clientData);
          HistoryModule.addAction(
            "Редактирование клиента",
            `Клиент "${clientData.name}" был изменен`
          );
        } else {
          clientData.id = Utils.generateId();
          StorageModule.addClient(clientData);
          HistoryModule.addAction(
            "Добавление клиента",
            `Клиент "${clientData.name}" был добавлен`
          );
        }

        this.loadClients();
        this.closeAllModals();
      } catch (error) {
        console.error("Ошибка при сохранении клиента:", error);
        alert(
          "Ошибка при обработке фотографии. Попробуйте выбрать другое изображение."
        );
      }
    };

    saveWithPhoto();
  },

  markMeetingCompleted: function (clientId) {
    const client = this.clients.find((c) => c.id === clientId);
    if (client) {
      client.meetingDate = null;
      StorageModule.updateClient(client);
      HistoryModule.addAction(
        "Встреча завершена",
        `Встреча с клиентом "${client.name}" отмечена как завершенная`
      );
      this.loadClients();
      this.closeAllModals();
    }
  },

  cancelMeeting: function (clientId) {
    const client = this.clients.find((c) => c.id === clientId);
    if (client) {
      client.meetingDate = null;
      StorageModule.updateClient(client);
      HistoryModule.addAction(
        "Встреча отменена",
        `Встреча с клиентом "${client.name}" отменена`
      );
      this.loadClients();
      this.closeAllModals();
    }
  },

  deleteClient: function (clientId) {
    const client = this.clients.find((c) => c.id === clientId);
    if (client) {
      StorageModule.deleteClient(clientId);
      HistoryModule.addAction(
        "Удаление клиента",
        `Клиент "${client.name}" был удален`
      );
      this.loadClients();
      this.closeAllModals();
    }
  },

  filterClients: function (searchTerm) {
    const filteredClients = this.clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.renderFilteredClients(filteredClients);
  },

  renderFilteredClients: function (filteredClients) {
    const clientsList = document.getElementById("clients-list");
    const emptyMessage = document.getElementById("empty-clients-message");

    if (filteredClients.length === 0) {
      clientsList.innerHTML = "";
      emptyMessage.classList.add("active");
      return;
    }

    emptyMessage.classList.remove("active");
    clientsList.innerHTML = filteredClients
      .map(
        (client) => `
      <tr>
        <td><input type="checkbox" class="client-checkbox" data-id="${
          client.id
        }"></td>
        <td><img src="${
          client.photo || this.getDefaultPhoto()
        }" alt="Фото" class="client-photo" onerror="this.src='${this.getDefaultPhoto()}'"></td>
        <td>${client.name}</td>
        <td>${client.phone}</td>
        <td>${client.address}</td>
        <td>${
          client.meetingDate
            ? Utils.formatDate(client.meetingDate)
            : "Не назначена"
        }</td>
        <td>
          <button class="btn-secondary view-client" data-id="${
            client.id
          }">Просмотр</button>
          <button class="btn-secondary edit-client" data-id="${
            client.id
          }">Изменить</button>
        </td>
      </tr>
    `
      )
      .join("");

    this.addClientActionHandlers();
  },

  toggleSelectAll: function (checked) {
    document.querySelectorAll(".client-checkbox").forEach((checkbox) => {
      checkbox.checked = checked;
    });
  },

  // Просмотр фото в полном размере
  viewPhoto: function (photoUrl, clientName = "") {
    this.closeAllModals();

    const fullSizePhoto = document.getElementById("full-size-photo");
    const photoModal = document.getElementById("photo-viewer-modal");

    // Устанавливаем фото
    fullSizePhoto.src = photoUrl || this.getDefaultPhoto();
    fullSizePhoto.alt = `Фото клиента ${clientName}`;

    // Показываем модальное окно
    photoModal.style.display = "block";
    document.getElementById("modal-overlay").classList.add("active");
  },

  // Обработчик клика по фото в таблице
  setupPhotoClickHandlers: function () {
    const self = this;

    // Обработчики для фото в таблице клиентов
    document
      .querySelectorAll(".clients-table .client-photo")
      .forEach((photo) => {
        photo.addEventListener("click", function () {
          const clientId = this.closest("tr")
            .querySelector(".client-checkbox")
            .getAttribute("data-id");
          const client = self.clients.find((c) => c.id === clientId);
          if (client) {
            self.viewPhoto(client.photo, client.name);
          }
        });
      });

    // Обработчик для фото в деталях клиента
    const detailsPhoto = document.getElementById("details-client-photo");
    if (detailsPhoto) {
      detailsPhoto.addEventListener("click", function () {
        const clientName = document.getElementById(
          "client-details-name"
        ).textContent;
        self.viewPhoto(this.src, clientName);
      });
    }
  },
};
