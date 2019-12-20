require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');

describe('blog route', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can post a blog post', async() => {
    await User.create({ email: 'test@test.com', password: 'password' });
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'password' });

    return agent
      .post('/api/v1/blog/new')
      .send({ title: 'my first post', content: 'this is my content', category: 'Tech' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'my first post', 
          content: 'this is my content', 
          category: 'Tech',
          __v: 0
        });
      });
  });

  it('can get all blog posts', async() => {
    const posts = await Post.create([
      { title: 'my first post', content: 'this is my content', category: 'Tech' },
      { title: 'my second post', content: 'this is my content', category: 'Political' }
    ]);

    return request(app)
      .get('/api/v1/blog')
      .then(res => {
        posts.forEach(post => {
          expect(res.body).toContainEqual({
            _id: post.id,
            title: post.title,
            content: post.content,
            category: post.category,
            __v: 0
          });
        });
      });
  });

  it('can update a blog post', async() => {
    const post = await Post.create(
      { title: 'my first post', content: 'this is my content', category: 'Tech' });
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', password: 'password' });

    return agent
      .patch(`/api/v1/blog/${post._id}`)
      .send({ title: 'My tech post' })
      .then(res => {
        expect(res.body).toEqual({
          _id: post.id,
          title: 'My tech post',
          content: post.content,
          category: post.category,
          __v: 0
        });
      });
  });

  it('can delete a blog post', async() => {
    const post = await Post.create(
      { title: 'my first post', content: 'this is my content', category: 'Tech' });
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', password: 'password' });

    return agent
      .delete(`/api/v1/blog/${post._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: post.id,
          title: 'my first post',
          content: post.content,
          category: post.category,
          __v: 0
        });
      });
  });

  it('can get a post by id', async() => {
    const post = await Post.create({ title: 'my first post', content: 'this is my content', category: 'Tech' });

    return request(app)
      .get(`/api/v1/blog/${post._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: post.id,
          title: 'my first post',
          content: post.content,
          category: post.category,
          __v: 0
        });
      });
  });
});
