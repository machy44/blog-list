const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'myths-about-useeffect',
    author: 'Kent C. Dodds',
    url: 'https://epicreact.dev/myths-about-useeffect/',
    likes: 1,
  },
  {
    content: 'the-state-initializer-pattern',
    author: 'Kent C. Dodds',
    url: 'https://kentcdodds.com/blog/the-state-initializer-pattern',
    likes: 1,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
