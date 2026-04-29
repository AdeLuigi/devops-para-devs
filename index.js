const express = require('express');
const app = express();
app.use(express.json());

const tasks = [];

app.get('/tasks', (req, res) => res.json(tasks));
app.post('/tasks', (req, res) => {
  tasks.push(req.body);
  res.status(201).json(req.body);
});

app.listen(3001, () => console.log('rodando na porta 3001'));