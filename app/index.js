
const express = require('express');
const app = express();
app.use(express.json());

const tasks = [
  { id: 1, title: 'Aprender Docker', done: true },
  { id: 2, title: 'Configurar CI/CD', done: true },
  { id: 3, title: 'Fazer deploy no Render', done: false },
];

app.get('/tasks', (req, res) => res.json(tasks));
app.post('/tasks', (req, res) => {
  const task = { id: tasks.length + 1, title: req.body.title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});
  
if (require.main === module) {
  app.listen(3001, () => console.log('rodando na porta 3001'));
}

module.exports = app;





