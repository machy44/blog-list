const bcrypt = require('bcrypt');
const User = require('../models/user');
const Blog = require('../models/blog');
const helper = require('./test_helper');
const app = require('../app');
const supertest = require('supertest');

const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await Blog.deleteMany();
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', password: passwordHash });

    await user.save();
  });

  describe('unsuccessful user creation', () => {
    test('username is required', async () => {
      const usersAtStart = await helper.usersInDb();

      const invalidNewUser = {
        name: 'Matti Moja',
        password: 'test',
      };

      const result = await api
        .post('/api/users')
        .send(invalidNewUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('`username` is required');

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
    test('password is required', async () => {
      const usersAtStart = await helper.usersInDb();

      const invalidNewUser = {
        name: 'Matti Moja',
        username: 'test',
      };

      const result = await api
        .post('/api/users')
        .send(invalidNewUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('password is required');

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
    test('password is too short', async () => {
      const usersAtStart = await helper.usersInDb();

      const invalidNewUser = {
        name: 'Matti Moja',
        username: 'test',
        password: 'la',
      };

      const result = await api
        .post('/api/users')
        .send(invalidNewUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('password is too short');

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
    test('username is too short', async () => {
      const usersAtStart = await helper.usersInDb();

      const invalidNewUser = {
        name: 'Matti Moja',
        username: 'te',
        password: 'lala',
      };

      const result = await api
        .post('/api/users')
        .send(invalidNewUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain(
        'shorter than the minimum allowed length'
      );

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
    test('username must be unique', async () => {
      const usersAtStart = await helper.usersInDb();

      const invalidNewUser = {
        name: 'root',
        username: 'root',
        password: 'lala',
      };

      const result = await api
        .post('/api/users')
        .send(invalidNewUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('`username` to be unique');

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
  });
  describe('successful user creation', () => {
    test('user is created', async () => {
      const usersAtStart = await helper.usersInDb();

      const validNewUser = {
        name: 'test',
        username: 'test',
        password: 'test',
      };

      await api
        .post('/api/users')
        .send(validNewUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      expect(usernames).toContain(validNewUser.username);
    });
  });
});
