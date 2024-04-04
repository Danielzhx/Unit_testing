// Import supertest for HTTP requests
const request = require('supertest');
// note that we take advantage of @jest/globals (describe, it, expect, etc.)
// API for expect can be found here: https://jestjs.io/docs/expect

const app = require('../index');

describe('Endpoint tests', () => {
  // Make sure the server is in default state when testing
  beforeEach(async () => {
    await request(app).get('/api/v1/reset');
  });

  /*---------------------------
   Write your tests below here
  ---------------------------*/
  //*******************************************BASIC TESTS******************************************//
  describe('Basic succesful tests:', () => {
    //------------------------------------Basic Tests Group 01------------------------------------
    describe('Testing succesful GET requests on the Endpoint: /api/v1/books', () => {
      it('Expecting successful response of status code 200', async () => {
        const response = await request(app).get('/api/v1/books');
        expect(response.statusCode).toBe(200);
      });

      it('Expecting successful response with a defined body', async () => {
        const response = await request(app).get('/api/v1/books');
        expect(response.body).toBeDefined();
      });

      it('Expecting successful response with a body of type Array', async () => {
        const response = await request(app).get('/api/v1/books');
        expect(Array.isArray(response.body)).toBeTruthy();
      });

      it('Expecting successful response with the right amount of elements in the body', async () => {
        const response = await request(app).get('/api/v1/books');
        expect(response.body).toHaveLength(3);
      });
    });

    //------------------------------------Basic Tests Group 02------------------------------------
    describe('Testing succesful GET requests on the Endpoint: /api/v1/genres/:genreId/books/:bookId', () => {
      it('Expecting successful response of status code 200', async () => {
        const response = await request(app).get('/api/v1/genres/1/books/2');
        expect(response.statusCode).toBe(200);
      });

      it('Expecting successful response with a defined body', async () => {
        const response = await request(app).get('/api/v1/genres/1/books/2');
        expect(response.body).toBeDefined();
      });

      it('Expecting successful response with the right attributes and values in the body', async () => {
        const response = await request(app).get('/api/v1/genres/2/books/3');
        expect(response.body).toEqual({
          id: 3,
          title: 'Brief Answers to the Big Questions',
          author: 'Stephen Hawking',
          genreId: 2,
        });
      });
    });

    //------------------------------------Basic Tests Group 03------------------------------------
    describe('Testing succesful PATCH requests on the Endpoint: /api/v1/genres/:genreId/books/:bookId', () => {
      it('Expecting successful response of status code 200', async () => {
        const updatedBook = {
          title: 'SUIIII',
          author: 'Cristiano Ronaldo',
          genreId: 3,
        };

        const response = await request(app)
          .patch('/api/v1/genres/1/books/2')
          .send(updatedBook);

        expect(response.statusCode).toBe(200);
      });

      it('Expecting successful response with a defined body', async () => {
        const updatedBook = {
          title: 'Sapiens: A Brief History of Humankind',
          author: 'Yuval Noah Harari',
          genreId: 2,
        };

        const response = await request(app)
          .patch('/api/v1/genres/1/books/1')
          .send(updatedBook);

        expect(response.body).toBeDefined();
      });

      it('Expecting successful response with the right attributes and values in the body', async () => {
        const updatedBook = {
          title: 'Sapiens: A Brief History of Humankind',
          author: 'Yuval Noah Harari',
          genreId: 2,
        };

        const response = await request(app)
          .patch('/api/v1/genres/1/books/1')
          .send(updatedBook);

        expect(response.body).toEqual({
          id: 1,
          title: 'Sapiens: A Brief History of Humankind',
          author: 'Yuval Noah Harari',
          genreId: 2,
        });
      });
    });
  });

  //******************************************FAILURE TESTS*****************************************//
  describe('Failure tests:', () => {
    //------------------------------------Failure Tests Group 01------------------------------------
    describe('Testing failure PATCH requests with an incorrect old genreID on the Endpoint: /api/v1/genres/:genreId/books/:bookId', () => {
      it('Expecting failure response of status code 404', async () => {
        const updatedBook = {
          title: 'Homo Deus',
          author: 'Yuval Noah Harari',
          genreId: 2,
        };
        const response = await request(app)
          .patch('/api/v1/genres/4/books/1')
          .send(updatedBook);

        expect(response.statusCode).toBe(404);
      });

      it('Expecting failure response with a defined body', async () => {
        const updatedBook = {
          title: 'The Da Vinci Code',
          author: 'Dan Brown',
          genreId: 3,
        };
        const response = await request(app)
          .patch('/api/v1/genres/3/books/2')
          .send(updatedBook);

        expect(response.body).toBeDefined();
      });

      it('Expecting failure response with the correct error message', async () => {
        const updatedBook = {
          title: 'The Da Vinci Code',
          author: 'Dan Brown',
          genreId: 3,
        };

        const response = await request(app)
          .patch('/api/v1/genres/1/books/3')
          .send(updatedBook);

        expect(response.body).toEqual({
          message: `Book with id 3 does not exists in genre id 1.`,
        });
      });
    });

    //------------------------------------Failure Tests Group 02------------------------------------
    describe('Testing failure PATCH requests with all invalid properties in the body on the Endpoint: /api/v1/genres/:genreId/books/:bookId', () => {
      it('Expecting failure response of status code 400', async () => {
        const updatedBook = {
          title: 23,
          author: 81729,
          genreId: 'blabla',
        };
        const response = await request(app)
          .patch('/api/v1/genres/1/books/1')
          .send(updatedBook);

        expect(response.statusCode).toBe(404);
      });

      it('Expecting failure response with a defined body', async () => {
        const updatedBook = {
          title: 324,
          author: 21,
        };
        const response = await request(app)
          .patch('/api/v1/genres/3/books/2')
          .send(updatedBook);

        expect(response.body).toBeDefined();
      });

      it('Expecting failure response with the correct error message', async () => {
        const updatedBook = {};
        const response = await request(app)
          .patch('/api/v1/genres/1/books/2')
          .send(updatedBook);

        expect(response.body).toEqual({
          message:
            'To update a book, you need to provide a title, an author, or a new genreId.',
        });
      });
    });

    //------------------------------------Failure Tests Group 03------------------------------------
    describe('Testing failure GET requests with an inexisting book ID on the Endpoint: /api/v1/genres/:genreId/books/:bookId', () => {
      it('Expecting failure response of status code 404', async () => {
        const response = await request(app).get('/api/v1/genres/2/books/9');
        expect(response.statusCode).toBe(404);
      });

      it('Expecting failure response with a defined body', async () => {
        const response = await request(app).get('/api/v1/genres/4/books/12');
        expect(response.body).toBeDefined();
      });

      it('Expecting failure response with the correct error message', async () => {
        const response = await request(app).get('/api/v1/genres/2/books/100');
        expect(response.body).toEqual({
          message: `Book with id 100 does not exist`,
        });
      });
    });

    //------------------------------------Failure Tests Group 04------------------------------------
    describe('Testing failure POST requests with an inexisting book ID on the Endpoint: /api/v1/genres/:genreId/books', () => {
      it('Expecting failure response of status code 400', async () => {
        const newBook = { title: 'No Author' };
        const response = await request(app)
          .post('/api/v1/genres/4/books')
          .send(newBook);

        expect(response.statusCode).toBe(400);
      });

      it('Expecting failure response with a defined body', async () => {
        const newBook = { title: 'No Author' };
        const response = await request(app)
          .post('/api/v1/genres/4/books')
          .send(newBook);

        expect(response.body).toBeDefined();
      });

      it('Expecting failure response with the correct error message', async () => {
        const newBook = { title: 'No Author' };
        const response = await request(app)
          .post('/api/v1/genres/4/books')
          .send(newBook);

        expect(response.body).toEqual({
          message:
            'Missing required book fields within the body (title, author).',
        });
      });
    });

    //------------------------------------Failure Tests Group 05------------------------------------
    describe('Testing failure POST requests with an incorrect authorization on the Endpoint: /api/v1/genres', () => {
      it('Expecting failure response of status code 403', async () => {
        const newGenre = { name: 'Novel' };
        const response = await request(app)
          .post('/api/v1/genres')
          .set('Authorization', 'HMAC 00000')
          .send(newGenre);

        expect(response.statusCode).toBe(403);
      });

      it('Expecting failure response with a defined body', async () => {
        const newGenre = { name: 'Novel' };
        const response = await request(app)
          .post('/api/v1/genres')
          .set('Authorization', 'HMAC 00000')
          .send(newGenre);

        expect(response.body).toBeDefined();
      });

      it('Expecting failure response with the correct error message', async () => {
        const newGenre = { name: 'Novel' };
        const response = await request(app)
          .post('/api/v1/genres')
          .set('Authorization', 'HMAC 00000')
          .send(newGenre);

        expect(response.body).toEqual({ message: 'Wrong hash.' });
      });
    });
  });

  //*****************************************POST GENRE TEST***************************************//
  describe('Testing a POST request replay attack on the Endpoint: /api/v1/genres', () => {
    it('Expecting a sccessful response for creating a new genre', async () => {
      const newGenre = { name: 'Attack Novel' };
      const response = await request(app)
        .post('/api/v1/genres')
        .set(
          'Authorization',
          'HMAC d5951928a797e3de418978abeb1c4f036672aa63b3241843493bfae1c0e60923',
        )
        .set('Content-Type', 'application/json')
        .send(newGenre);

      expect(response.statusCode).toBe(201);
      expect(response.body).toBeDefined();
    });
  });

  // Try to call and endpoint that does not exists
  it('Example Test: should return a 404 status for a non-existent endpoint', async () => {
    const response = await request(app).get('/api/v1/nonExistentEndpoint');
    expect(response.statusCode).toBe(404);
  });
});
