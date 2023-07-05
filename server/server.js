const express = require("express");
const { google } = require("googleapis");

const app = express();
app.use(express.json());

// Конфигурация доступа к Google Sheets API
const credentials = require("./credentials.json");
const { client_email, private_key } = credentials;
const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
const jwt = new google.auth.JWT(client_email, null, private_key, scopes);
const sheets = google.sheets({ version: "v4", auth: jwt });
const spreadsheetId = "1mvszRlqWguLJkOgwAsQcrxn_ex1QrNpGMq2zdUjt9lc";

// Обработчик маршрута для получения данных из Google Sheets
app.get("/api/data", async (req, res) => {
  const param = req.query.param; // Получение значения параметра из запроса

  // Здесь выполняется ваша логика для проверки наличия параметра в Google Sheets и получения данных
  try {
    // Запрос к Google Sheets API для получения данных
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Лист1!A1:B",
    });

    const rows = response.data.values;

    const filteredRows = rows.filter((row) => row.includes(param));
    console.log(filteredRows);
    if (filteredRows) {
      // Вывод данных следующей строки
      const [id, data] = filteredRows.flat();
      console.log(data);
      res.send(data);
    } else {
      res.send(null);
    }
  } catch (error) {
    console.error("Error retrieving data from Google Sheets:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Запуск сервера на порту 3001
app.listen(3000, () => {
  console.log("Server is running on port 3001");
});
