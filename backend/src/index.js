const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Подключение к PostgreSQL
const sequelize = new Sequelize('english_words', 'postgres', 'postgres', {
  host: 'postgres',
  dialect: 'postgres',
  port: 5432
});

// Модель слова
const Word = sequelize.define('Word', {
  english: {
    type: DataTypes.STRING,
    allowNull: false
  },
  russian: {
    type: DataTypes.STRING,
    allowNull: false
  },
  examples: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium'
  }
});

// Синхронизация модели с базой данных
sequelize.sync()
  .then(() => console.log('Database & tables created!'))
  .catch(err => console.error('Error syncing database:', err));

// Роуты
app.get('/api/words', async (req, res) => {
  const words = await Word.findAll();
  res.json(words);
});

app.post('/api/words', async (req, res) => {
  const word = await Word.create(req.body);
  res.status(201).json(word);
});

app.put('/api/words/:id', async (req, res) => {
  const word = await Word.findByPk(req.params.id);
  if (!word) {
    return res.status(404).json({ error: 'Word not found' });
  }
  await word.update(req.body);
  res.json(word);
});

app.delete('/api/words/:id', async (req, res) => {
  const word = await Word.findByPk(req.params.id);
  if (!word) {
    return res.status(404).json({ error: 'Word not found' });
  }
  await word.destroy();
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});