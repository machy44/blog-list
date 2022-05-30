const blogsRouter = require('express').Router();
const userExtractor = require('../utils/middleware').userExtractor;

const Blog = require('../models/blog');
const Comment = require('../models/comment');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find().populate('user', { username: 1, name: 1 }).populate('comments', {text: 1});
  response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const user = request.user;

  if (blog.user && blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    user.blogs = user.blogs.filter((blogId) => {
      return blogId.toString() !== request.params.id;
    });
    await user.save();
    return response.status(204).send();
  }

  response.status(401).send();
});

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const body = request.body;

  const blog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
  };

  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedNote);
});

blogsRouter.post('/:id/comments', userExtractor, async (request, response) => {
  const body = request.body;

  const blog = await Blog.findById(request.params.id);

  if (blog) {
    const comment = new Comment({
      text: body.text,
      blog: request.params.id
    });
    const savedComment = await comment.save();
    blog.comments = blog.comments.concat(savedComment._id);
    await blog.save();
  
    response.status(201).json(savedComment);
  }

  response.status(404).send();

});



module.exports = blogsRouter;
