const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(__dirname));

// Инициализация файла данных
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ sun: 0, cloud: 0, rain: 0, dots: [] }));
}

// Получить все данные
app.get('/api/data', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE));
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: "Ошибка чтения данных" });
    }
});

// Сохранить реакцию
app.post('/api/react', (req, res) => {
    const { type, x, y } = req.body;
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE));
        data[type]++;
        data.dots.push({ type, x, y, id: Date.now() });
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Ошибка записи данных" });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер летит на: http://localhost:${PORT}`);
});