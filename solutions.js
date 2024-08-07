const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());
const port = 3000;

const pool = new Pool ({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books')
    res.json(result)
  } catch (error) {
  console.err(error)
  res.status(500).json({ message: 'An error occurred while querying the data', error});
  }
});
/* Use postman:
(in vs code) Click Postman -> New HTTP Request -> Method: GET, URL: http://localhost:3000/api/books/ -> Click Send.
*/

app.post('/api/books', async (req, res) => {
  const { id, title, author, published_date, genre, author_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO books (id, title, author, published_date, genre, author_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, title, author, published_date, genre, author_id]
    );
    res.status(201).json(result.rows[0])
    console.log('Succesfull')
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occured while insert the data' });
  }
});
/* Use postman:
(in vs code) Click Postman -> New HTTP Request -> Method: POST, URL: http://localhost:3000/api/books -> Body -> Click raw and select JSON -> Type this:
{
   "id": 1,
   "title": "Film name",
   author: "Aaron Sorkin",
   "published_date": "2000-12-30",
   "genre": "Horror",
   "author_id": 1
}
-> Click Send.
*/

app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM books WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        return res.status(404).send('Book is not available.');
      }
    res.status(201).json(result.rows[0])
    console.log('Succesfully deleted')
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occured while delete the data' });
  }
});
/* Use postman:
(in vs code) Click Postman -> New HTTP Request -> Method: DELETE, URL: http://localhost:3000/api/books/1 -> Click Send.
*/

app.get('/api/authors', async (req, res) => {
  try {
    const result = await pool.query('SELECT author FROM books')
    res.json(result)
    console.log(result);
  } catch (error) {
    console.err(error)
    res.status(500).json({ message: 'An error occurred while querying the data', error});
  }
});
/* Use postman:
(in vs code) Click Postman -> New HTTP Request -> Method: GET, URL: http://localhost:3000/api/authors/ -> Click Send.
*/

app.post('/api/authors', async (req, res) => {
  const { author } = req.body;
  try {
    const result = await pool.query('INSERT INTO books (author) VALUES ($1) RETURNING author',
    [author]
    );
    res.status(201).json(result.rows[0]);
    console.log(`${author} succesfully added to books`)
  } catch (error) {
    console.log(error);
  }
});
/* Use postman:
(in vs code) Click Postman -> New HTTP Request -> Method: POST, URL: http://localhost:3000/api/authors/ -> Body -> Click raw and select JSON -> Type this:
{
   "author": "Ady Endre"
}
-> Click Send.
*/

app.put('/api/authors/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, published_date, genre } = req.body;
  try {
    const result = await pool.query(
      'UPDATE books SET title = $1, author = $2, published_date = $3, genre = $4 WHERE id = $5 RETURNING *',
      [title, author, published_date, genre, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('Book is not available.')
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occured while updating the data');
  }
});

/* Use postman:
(in vs code) Click Postman -> New HTTP Request -> Method: PUT, URL: http://localhost:3000/api/authors/1 -> Body -> Click raw and select JSON -> Type this:
{
   "author": "Ady Endre"
}
-> Click Send.
*/

app.listen(port, () => {
  console.log(`Server is running on ${port} port`)
})
