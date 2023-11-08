/* eslint-disable linebreak-style */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/peopleContact');

const app = express();

app.use(express.json());

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(cors());
app.use(express.static('dist'));

app.use(morgan(':method :url :status :response-time ms - :body'));

app.use((request, response, next) => {
  request.requestDate = new Date().toUTCString();
  next();
});

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    contex: 'query',
  })
    .then((result) => {
      response.send(result);
      console.log('Data updated successfully', result);
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/api/persons/:id', (request, response, next) => {
  const reqId = request.params.id;
  Person.findById(reqId)
    .then((dbRes) => {
      if (dbRes.length === 0) {
        response.statusMessage = `the id ${reqId} not present`;
        response.status(404).end(`the id ${reqId} not present`);
      } else {
        response.send(dbRes);
        console.log(dbRes);
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.send(result).end();
      console.log(result, 'data removed successfully');
    })
    .catch((error) => {
      next(error);
    });
});
app.post('/api/persons', (request, response, next) => {
  const { body } = request;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  Person.find({ name: body.name, number: body.number })
    .then((result) => {
      if (result.length > 0) {
        return response.status(400).json({
          error: 'name available',
        });
      }

      person
        .save()
        .then((result) => {
          response.send(person);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((data) => {
      response.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

app.get('/api/info', (request, response, next) => {
  Person.find({})
    .then((dbRes) => {
      response.send(
        `<div><p>Phonebook has info for ${dbRes.length} people</p><p>${request.requestDate}</p></div>`,
      );
    })
    .catch((error) => {
      next(error);
    });
});

function unknownEndpoint(req, res) {
  res
    .status(404)
    .send({ message: 'sorry the endpoint you requested does not exist' });
}

app.use(unknownEndpoint);

function errorHandler(error, request, response, next) {
  console.error(error);

  const statuscode = error.statusCode || 500;
  const errormessage = error.message || 'internal server error';

  response.status(statuscode).send(errormessage);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
