// js/calendar.js
// Модуль календаря и управления встречами

const CalendarModule = {
  currentDate: new Date(),

  init: function () {
    this.setupEventListeners();
  },

  setupEventListeners: function () {
    // Кнопки переключения месяцев
    document.getElementById("prev-month").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
    });

    document.getElementById("next-month").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
    });
  },

  renderCalendar: function () {
    // Обновляем заголовок
    document.getElementById("current-month").textContent =
      Utils.getMonthName(this.currentDate.getMonth()) +
      " " +
      this.currentDate.getFullYear();

    const calendarDays = document.getElementById("calendar-days");
    calendarDays.innerHTML = "";

    // Получаем первый день месяца и день недели
    const firstDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Приводим к формату Пн-Вс (0-6)

    // Получаем количество дней в месяце
    const daysInMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    ).getDate();

    // Получаем встречи для отображения в календаре
    const clients = StorageModule.getClients();
    const meetings = clients
      .filter((client) => client.meetingDate)
      .map((client) => ({
        date: new Date(client.meetingDate),
        clientName: client.name,
      }));

    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < startingDay; i++) {
      const emptyCell = document.createElement("div");
      calendarDays.appendChild(emptyCell);
    }

    // Добавляем дни текущего месяца
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.textContent = day;

      const currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        day
      );
      currentDate.setHours(0, 0, 0, 0);

      // Проверяем, является ли день сегодняшним
      if (currentDate.getTime() === today.getTime()) {
        dayElement.classList.add("today");
      }

      // Проверяем, есть ли встречи в этот день
      const hasMeeting = meetings.some((meeting) => {
        const meetingDate = new Date(meeting.date);
        meetingDate.setHours(0, 0, 0, 0);
        return meetingDate.getTime() === currentDate.getTime();
      });

      if (hasMeeting) {
        dayElement.classList.add("has-meeting");
      }

      // Добавляем обработчик клика
      dayElement.addEventListener("click", () => {
        this.showDayMeetings(currentDate);
      });

      calendarDays.appendChild(dayElement);
    }
  },

  showDayMeetings: function (date) {
    const clients = StorageModule.getClients();
    const dayMeetings = clients.filter((client) => {
      if (!client.meetingDate) return false;

      const meetingDate = new Date(client.meetingDate);
      meetingDate.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      return meetingDate.getTime() === date.getTime();
    });

    if (dayMeetings.length > 0) {
      let message = `Встречи на ${Utils.formatDate(date)}:\n`;
      dayMeetings.forEach((meeting) => {
        message += `- ${meeting.name} (${meeting.phone})\n`;
      });
      alert(message);
    } else {
      alert(`На ${Utils.formatDate(date)} встреч не запланировано.`);
    }
  },

  loadWeeklyMeetings: function () {
    const weeklyMeetings = document.getElementById("weekly-meetings");
    const clients = StorageModule.getClients();

    // Получаем даты на ближайшие 7 дней
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Фильтруем встречи на ближайшую неделю
    const upcomingMeetings = clients.filter((client) => {
      if (!client.meetingDate) return false;

      const meetingDate = new Date(client.meetingDate);
      meetingDate.setHours(0, 0, 0, 0);

      return meetingDate >= today && meetingDate <= nextWeek;
    });

    // Сортируем по дате
    upcomingMeetings.sort(
      (a, b) => new Date(a.meetingDate) - new Date(b.meetingDate)
    );

    if (upcomingMeetings.length === 0) {
      weeklyMeetings.innerHTML =
        "<p>На ближайшую неделю встреч не запланировано.</p>";
      return;
    }

    weeklyMeetings.innerHTML = upcomingMeetings
      .map(
        (meeting) => `
            <div class="meeting-item">
                <div>
                    <strong>${meeting.name}</strong><br>
                    <span>${Utils.formatDate(meeting.meetingDate)}</span>
                </div>
                <div>
                    <button class="btn-secondary view-client" data-id="${
                      meeting.id
                    }">Просмотр</button>
                </div>
            </div>
        `
      )
      .join("");

    // Добавляем обработчики для кнопок просмотра
    document
      .querySelectorAll("#weekly-meetings .view-client")
      .forEach((button) => {
        button.addEventListener("click", (e) => {
          const clientId = e.target.getAttribute("data-id");
          ClientsModule.viewClient(clientId);
        });
      });
  },
};
