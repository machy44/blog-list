const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const requestLogger = (request, response, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
  }
};

const errorHandler = (error, request, response, next) => {
  console.error('message', error.message);
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  console.log('next');
  next(error); // forward to generic express error
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
