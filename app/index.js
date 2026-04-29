
const express = require('express');
const client = require('prom-client');

const app = express();
app.use(express.json());

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

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
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));
   if (index === -1) return res.status(404).json({ error: 'Task não encontrada' });
   const [deleted] = tasks.splice(index, 1);
   res.json(deleted);
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

if (require.main === module) {
  app.listen(3001, () => console.log('rodando na porta 3001'));
}

module.exports = app;





