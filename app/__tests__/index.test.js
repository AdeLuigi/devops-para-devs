const request = require('supertest');
const app = require('../index');

describe('GET /tasks', () => {
  it('retorna lista vazia inicialmente', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /tasks', () => {
  it('cria uma tarefa e retorna 201', async () => {
    const task = { title: 'Estudar DevOps' };
    const res = await request(app).post('/tasks').send(task);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(task);
  });

  it('tarefa criada aparece no GET /tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toContainEqual({ title: 'Estudar DevOps' });
  });
});
