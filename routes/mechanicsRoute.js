//requiring the necessary packages at the top of your file:
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// Define routes for the users resource
const mechanicsRoute = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set up a connection to your database by adding the following code to your index.js file:
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mechex',
    password: 'chinelo',
    port: 5432,
});

pool.connect()
    .then(() => console.log('Connected to Postgres database'))
    .catch(err => console.error('Failed to connect to Postgres database', err.stack));



// example route; Define your API endpoints. These are the routes that your client-side code will use to interact with your server and database.
mechanicsRoute.get('/', (req, res) => {
    //Your code to retrieve all users from the database
    res.send('This is the response for GET /users');
    pool.query('SELECT * FROM public.mechanics ORDER BY id ASC', (error, results) => {
        if (error) {
            console.log(error)
        } else {
            res.status(200).json(results.rows)
        }
    });
});

/*
//gets/searches for mechanics based on their address
mechanicsRoute.get('/api/mechanics', async (req, res) => {
    const { address } = req.query;
  
    try {
      // Query the database for mechanics with a matching address
      const mechanics = await Mechanic.find({ address });
      res.json(mechanics);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });*/
  
//get mechanics by their city
  mechanicsRoute.get('/:city', (req, res) => {
    /* const mechanicId = req.params.id;
      code to retrieve a user by ID from the database
     res.send(`This is the response for GET /users/${userId}`);*/
     const city = req.params.city
        console.log(city)
 
     pool.query('SELECT * FROM public.mechanics WHERE "city" LIKE $1', [`%${city}%`], (error, results) => {
        if (error) {
          console.log(error);
         res.status(500).json({ error: 'An error occurred while fetching mechanics' });
        } else {
          res.status(200).json(results.rows);
        }
      });
      
 
 });  
// GET /users/:id - Get a user by ID
mechanicsRoute.get('/:id', (req, res) => {
   /* const mechanicId = req.params.id;
     code to retrieve a user by ID from the database
    res.send(`This is the response for GET /users/${userId}`);*/
    const id = parseInt(req.params.id)

    pool.query('SELECT * FROM public.mechanics WHERE id = $1', [id], (error, results) => {
        if (error) {
            console.log(error)
        } else {
            res.status(200).json(results.rows)
        }
    });

});

// POST /users - Create a new user to be deleted
mechanicsRoute.post('/signups', (req, res) => {
    /* Your code to create a new user in the database
    res.send('This is the response for POST /users');*/
    const { name, phone, email, address, city, password, user_type } = req.body
    console.log(name, phone, email, address, password);

    pool.query('INSERT INTO public.mechanics (name, phone, email, address, city, password, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [name, phone, email, address, city, password, user_type], (error, results) => {
        if (error) {
            console.log(error)
        } else {
            res.status(201).send(`Mechanic added with ID: ${results.rows[0].id}`)
        }
    });
});

// PUT /users/:id - Update a user by ID
mechanicsRoute.put('/:id', (req, res) => {
    /*const userId = req.params.id;
      Your code to update a user by ID in the database
     res.send(`This is the response for PUT /users/${userId}`);*/
    const id = parseInt(req.params.id)
    const { name, phone, email, address, city, user_type } = req.body

    pool.query(
        'UPDATE public.mechanics SET name = $1, phone = $2, email = $3, address = $4, city = $5, password = $6, user_type = $7 WHERE id = $6',
        [name, phone, email, address, city, password,  user_type, id],
        (error, results) => {
            if (error) {
                console.log(error)
            }
            res.status(200).send(`Mechanic modified with ID: ${results.rows[0].id}`)
        }
    );
});

// DELETE /users/:id - Delete a user by ID
mechanicsRoute.delete('/:id', (req, res) => {
    /*const userId = req.params.id;
    // Your code to delete a user by ID from the database
    res.send(`This is the response for DELETE /users/${userId}`);*/
    const id = parseInt(req.params.id)

    pool.query('DELETE FROM public.mechanics WHERE id = $1', [id], (error, results) => {
        if (error) {
            console.log(error) 
        }
        res.status(200).send(`Mechanic deleted with ID: ${results.id}`)
    });
});

module.exports = mechanicsRoute;

// Add the users router to the app
app.use('/mechanics', mechanicsRoute);

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
