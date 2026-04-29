const request = require('supertest');
const app = require('../index');

describe('GET /tasks', () => {
  it('retorna as tasks iniciais', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, title: 'Aprender Docker', done: true },
      { id: 2, title: 'Configurar CI/CD', done: true },
      { id: 3, title: 'Fazer deploy no Render', done: false },
    ]);
  });
});

describe('GET /metrics', () => {
  it('retorna métricas no formato do Prometheus', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/plain/);
    expect(res.text).toContain('http_request_duration_seconds');
  });
});

describe('POST /tasks', () => {
  it('cria uma tarefa e retorna 201 com id e done false', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Estudar DevOps' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 4, title: 'Estudar DevOps', done: false });
  });

  it('tarefa criada aparece no GET /tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toContainEqual({ id: 4, title: 'Estudar DevOps', done: false });
  });
});
