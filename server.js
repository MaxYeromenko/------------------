const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5501;
const DATA_FILE = path.join(__dirname, '/saved-data.json');

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const validateData = (data) => {
    if (!data.name || !data.genre || !data.frequency) {
        return "Поля Ім'я, Жанр та Частота прослуховування є обов'язковими.";
    }
    return null;
};

app.post('/submit', (req, res) => {
    try {
        const newData = {
            name: req.body.name,
            genre: req.body.genre,
            frequency: req.body.frequency,
            artists: req.body.artists || [],
            comments: req.body.comments || ""
        };
        const error = validateData(newData);
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        let existingData = [];
        if (fs.existsSync(DATA_FILE)) {
            existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }

        existingData.push(newData);
        fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2));

        res.json({ success: true, message: 'Дані успішно збережено.' });
    }
    catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на: http://127.0.0.1:${PORT}`);
});
