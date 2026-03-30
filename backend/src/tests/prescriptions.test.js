import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import Prescription from '../models/Prescription.js';
import { generateToken } from '../utils/jwt.js';

let mongoServer;
let authToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });

  // set JWT secret for token creation
  process.env.JWT_SECRET = 'test-secret';
  authToken = `Bearer ${generateToken('fake-doctor-id', 'doctor')}`;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Prescription.deleteMany();
});

test('POST /api/prescriptions creates prescription and GET fetches it', async () => {
  const sample = {
    patientId: '507f1f77bcf86cd799439011',
    doctorId: '507f1f77bcf86cd799439012',
    medicines: [
      { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', duration: '7 days' }
    ],
    notes: 'Test prescription'
  };

  const createResponse = await request(app)
    .post('/api/prescriptions')
    .set('Authorization', authToken)
    .send(sample)
    .expect(201);

  expect(createResponse.body.success).toBe(true);
  expect(createResponse.body.data).toHaveProperty('_id');
  expect(createResponse.body.data.medicines[0].name).toBe('Amoxicillin');

  const getResponse = await request(app)
    .get('/api/prescriptions')
    .expect(200);

  expect(getResponse.body.success).toBe(true);
  expect(getResponse.body.data.length).toBe(1);
  expect(getResponse.body.data[0].notes).toBe('Test prescription');
});
