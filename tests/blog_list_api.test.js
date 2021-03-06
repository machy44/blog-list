const mongoose = require('mongoose');
const supertest = require('supertest').agent;
const helper = require('./test_helper');
const app = require('../app');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const api = supertest(app);


describe('blogs', () => {
  var token;

  beforeAll(async function () {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', password: passwordHash });

    await user.save();

    const res = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' });

    token = res.body.token;
  });

  beforeEach(async () => {
    const user = await User.findOne({ username: 'root' });
    const blogsWitUser = helper.createBlogsWithUser(user._id.toString());

    await Comment.deleteMany();
    await Blog.deleteMany();
    
    const blogs = await Blog.insertMany(blogsWitUser);
    //update user blogs also before each test
    user.blogs = blogs.map((blog) => {
      return blog._id;
    });
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Blog.deleteMany();
  });
  describe('viewing blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });
    test('there are two blogs', async () => {
      const response = await api.get('/api/blogs');

      expect(response.body).toHaveLength(helper.initialBlogs.length);
    });

    test('there should be id property', async () => {
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd[0].id).toBeDefined();
    });
  });

  describe('addition of a new blog', () => {
    test('return 401 because token is not provided', async () => {
      const newBlog = {
        title: 'newest',
        author: 'alen',
        url: 'this represents url',
        likes: 0,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'newest',
        author: 'alen',
        url: 'this represents url',
        likes: 0,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
      const titles = blogsAtEnd.map((r) => r.title);
      expect(titles).toContain('newest');
    });
    test('new blog can be added without likes key which is set to zero by default', async () => {
      const newBlog = {
        title: 'newest',
        author: 'alen',
        url: 'this represents url',
      };
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const likes = blogsAtEnd.map((r) => r.likes);
      const addedLikeValue = likes[likes.length - 1];
      expect(addedLikeValue).toBe(0);
    });
    test('blog without title is not added', async () => {
      const newBlog = {
        author: 'alen',
        url: 'url title',
        likes: 2,
      };
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });
    test('blog without url is not added', async () => {
      const newBlog = {
        author: 'alen',
        title: 'test title',
        likes: 2,
      };
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

    

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

      const titles = blogsAtEnd.map((blog) => blog.title);

      expect(titles).not.toContain(blogToDelete.title);

      //blog should be removed from user blogs array also
      const user = await helper.getUserByUsername('root');
      const userBlogsIds = user.blogs.map(blog => blog.id);
      expect(userBlogsIds).not.toContain(blogToDelete.id);
      
      
    });
    test('not succeeds with status code 400 if id is valid', async () => {
      await api
        .delete('/api/blogs/notValidId')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });
  });

  describe('blog update', () => {
    test('update should not pass if user is not authorized', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      expect(blogToUpdate.likes).toBe(1);

      blogToUpdate.likes = 2;
      await api(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(401);
    });
    test('update blog likes', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      expect(blogToUpdate.likes).toBe(1);
      blogToUpdate.likes = 2;
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogToUpdate)
        .expect(200);
      expect(blogToUpdate.likes).toBe(2);
    });
  });
  describe('blog comments', () => {

    const newComment = {
      text: 'test comment',
    };
    
    it('should add a comment to blog', async () => {
      const blogs = await helper.blogsInDb();
      

      await api
        .post(`/api/blogs/${blogs[0].id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(newComment)
        .expect(201);
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd[0].comments).toHaveLength(1);
    
    });
    it('should not add blog if not authorized', async () => {
      const blogs = await helper.blogsInDb();
 

      await api
        .post(`/api/blogs/${blogs[0].id}/comments`)
        .send(newComment)
        .expect(401);
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd[0].comments).toHaveLength(0);
    });
    it('return 400 because blog id doesnt exist', async () => {
      const unvalidId = 123;

      await api
        .post(`/api/blogs/${unvalidId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(newComment)
        .expect(400);
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd[0].comments).toHaveLength(0);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
