const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');

beforeAll(async () => {
  await Blog.deleteMany();
  await Blog.insertMany(helper.initialBlogs);
});

describe('viewing blogs', () => {
  // test('blogs are returned as json', async () => {
  //   await api.get('/api/blogs').expect(200);
  //   // .expect('Content-Type', /application\/json/);
  // });
  test('there are two blogs', async () => {
    const blogsAtEnd = await helper.blogsInDb();
    // const blogsAtEnd = await api.get('/api/blogs');

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('there should be id property', async () => {
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].id).toBeDefined();
  });
});

describe('addition of a new blog', () => {
  // test('a valid blog can be added', async () => {
  //   const newBlog = {
  //     title: 'newest',
  //     author: 'alen',
  //     url: 'this represents url',
  //     likes: 0,
  //   };
  //   await api.post('/api/blogs').send(newBlog);
  //   // .expect(201);
  //   // .expect('Content-Type', /application\/json/);
  //   const blogsAtEnd = await helper.blogsInDb();
  //   expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  //   const titles = blogsAtEnd.map((r) => r.title);
  //   expect(titles).toContain('newest');
  // });
  // test('new blog can be added without likes key which is set to zero by default', async () => {
  //   const newBlog = {
  //     title: 'newest',
  //     author: 'alen',
  //     url: 'this represents url',
  //   };
  //   await api
  //     .post('/api/blogs')
  //     .send(newBlog)
  //     .expect(201)
  //     .expect('Content-Type', /application\/json/);
  //   const blogsAtEnd = await helper.blogsInDb();
  //   const likes = blogsAtEnd.map((r) => r.likes);
  //   const addedLikeValue = likes[likes.length - 1];
  //   expect(addedLikeValue).toBe(0);
  // });
  // test('blog without title is not added', async () => {
  //   const newBlog = {
  //     author: 'alen',
  //     url: 'url title',
  //     likes: 2,
  //   };
  //   await api.post('/api/blogs').send(newBlog).expect(400);
  //   const blogsAtEnd = await helper.blogsInDb();
  //   expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  // });
  // test('blog without url is not added', async () => {
  //   const newBlog = {
  //     author: 'alen',
  //     title: 'test title',
  //     likes: 2,
  //   };
  //   await api.post('/api/blogs').send(newBlog).expect(400);
  //   const blogsAtEnd = await helper.blogsInDb();
  //   expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  // });
  test('update blog likes', () => {});
});

afterAll(() => {
  mongoose.connection.close();
});
