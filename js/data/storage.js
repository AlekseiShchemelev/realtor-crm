// js/data/storage.js
// Модуль работы с локальным хранилищем

const StorageModule = {
  // Ключи для localStorage
  keys: {
    CLIENTS: "realtor_crm_clients",
    HISTORY: "realtor_crm_history",
  },

  // Получение клиентов из хранилища
  getClients: function () {
    const clientsJson = localStorage.getItem(this.keys.CLIENTS);
    return clientsJson ? JSON.parse(clientsJson) : [];
  },

  // Сохранение клиентов в хранилище
  saveClients: function (clients) {
    localStorage.setItem(this.keys.CLIENTS, JSON.stringify(clients));
  },

  // Добавление клиента
  addClient: function (client) {
    const clients = this.getClients();
    clients.push(client);
    this.saveClients(clients);
  },

  // Обновление клиента
  updateClient: function (updatedClient) {
    const clients = this.getClients();
    const index = clients.findIndex((client) => client.id === updatedClient.id);

    if (index !== -1) {
      clients[index] = updatedClient;
      this.saveClients(clients);
    }
  },

  // Удаление клиента
  deleteClient: function (clientId) {
    const clients = this.getClients();
    const filteredClients = clients.filter((client) => client.id !== clientId);
    this.saveClients(filteredClients);
  },

  // Получение истории из хранилища
  getHistory: function () {
    const historyJson = localStorage.getItem(this.keys.HISTORY);
    return historyJson ? JSON.parse(historyJson) : [];
  },

  // Сохранение истории в хранилище
  saveHistory: function (history) {
    localStorage.setItem(this.keys.HISTORY, JSON.stringify(history));
  },

  // Добавление элемента истории
  addHistoryItem: function (historyItem) {
    const history = this.getHistory();
    history.push(historyItem);
    this.saveHistory(history);
  },

  // Очистка всех данных
  clearAllData: function () {
    localStorage.removeItem(this.keys.CLIENTS);
    localStorage.removeItem(this.keys.HISTORY);
  },
};
