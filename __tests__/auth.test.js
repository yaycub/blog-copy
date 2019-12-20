require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST a user with signup', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'test@test.com',
          __v: 0
        });
      });
  });

  it('can login a user', async() => {
    const user = await User.create({ email: 'test@test.com', password: 'password' });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password:'password' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: user.id,
          email: 'test@test.com',
          __v: 0
        });
      });
  });

  it('fails to login a user with the wrong email', async() => {
    await User.create({ email: 'test@test.com', password: 'password' });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'wrong@test.com', password:'password' })
      .then(res => {
        expect(res.body).toEqual({
          status: 401,
          message: 'Invalid Email/Password, D00D!'
        });
      });
  });

  it('fails to login a user with the wrong password', async() => {
    await User.create({ email: 'test@test.com', password: 'password' });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password:'WRONG' })
      .then(res => {
        expect(res.body).toEqual({
          status: 401,
          message: 'Invalid Email/Password, D00D!'
        });
      });
  });

  it('can verify a users token', async() => {
    const user = await User.create({ email: 'test@test.com', password: 'password' });
    const agent = request.agent(app);

    await agent 
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'password' });

    return agent
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: 'test@test.com',
          __v: 0
        });
      }); 
  });
});
