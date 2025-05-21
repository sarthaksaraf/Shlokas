const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');

const EMOTIONS_FILE = path.join(__dirname, '../Emotions.json');
const backupDir = path.join(__dirname, '../');
const basicAuth = 'Basic ' + Buffer.from(process.env.API_USER + ':' + process.env.API_PASS).toString('base64');

describe('Emotions API', () => {
  let originalData;
  beforeAll(() => {
    originalData = fs.readFileSync(EMOTIONS_FILE, 'utf8');
  });
  afterAll(() => {
    fs.writeFileSync(EMOTIONS_FILE, originalData);
  });

  it('GET /api/emotions returns all emotions', async () => {
    const res = await request(app).get('/api/emotions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/emotions/:id returns specific emotion', async () => {
    const res = await request(app).get('/api/emotions/0');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('emotion');
  });

  it('GET /api/emotions/:id returns 404 for invalid id', async () => {
    const res = await request(app).get('/api/emotions/9999');
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/emotions/update rejects invalid auth', async () => {
    const res = await request(app).post('/api/emotions/update').send([]);
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/emotions/update rejects invalid schema', async () => {
    const res = await request(app)
      .post('/api/emotions/update')
      .set('Authorization', basicAuth)
      .send([{ foo: 'bar' }]);
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/emotions/update accepts valid update and creates backup', async () => {
    const newData = [
      {
        emotion: 'Test',
        quote: 'Q',
        output: 'O',
        realization_prompt: 'R',
        playful_task: 'P'
      }
    ];
    const res = await request(app)
      .post('/api/emotions/update')
      .set('Authorization', basicAuth)
      .send(newData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('backup');
    // Clean up backup file
    const backupFile = path.join(backupDir, res.body.backup);
    if (fs.existsSync(backupFile)) fs.unlinkSync(backupFile);
  });

  it('GET /api/emotions/versions returns backup list', async () => {
    const res = await request(app).get('/api/emotions/versions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/emotions/version/:filename returns 400 for invalid filename', async () => {
    const res = await request(app).get('/api/emotions/version/not_a_backup.json');
    expect(res.statusCode).toBe(400);
  });
});
