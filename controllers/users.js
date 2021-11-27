const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find();
  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const body = request.body;

  const saltRounds = 10;
  if (body.password === undefined) {
    return response.status(400).json({
      error: 'password is required',
    });
  }
  if (body.password.length < 3) {
    return response.status(400).json({
      error: 'password is too short',
    });
  }

  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    password: passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = usersRouter;
