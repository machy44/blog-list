const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error('error: ', error);
  console.error('error name: ', error.name);
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  console.log('next');
  next(error); // forward to generic express error
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
