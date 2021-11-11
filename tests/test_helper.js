const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'myths-about-useeffect',
    author: 'Kent C. Dodds',
    url: 'https://epicreact.dev/myths-about-useeffect/',
    likes: 1,
  },
  {
    title: 'the-state-initializer-pattern',
    author: 'Kent C. Dodds',
    url: 'https://kentcdodds.com/blog/the-state-initializer-pattern',
    likes: 4,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find();
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
