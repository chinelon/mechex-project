//requiring the necessary packages at the top of your file:
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors');



//importing routers in index.js
const usersRoute = require('./routes/usersRoute');
app.use('/api/users', usersRoute);

const mechanicsRoute = require('./routes/mechanicsRoute');
app.use('/api/mechanics', mechanicsRoute);

const appointmentsRoute = require('./routes/appointmentsRoute');
app.use('/api/appointments', appointmentsRoute);

const progressRoute = require('./routes/progressRoute');
app.use('/api/progress', progressRoute);

/*Next, add middleware to your application. Middleware is software that lies between an operating 
system and the applications running on it, and is used to manage network resources and other aspects of the system.*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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
app.get('/', (req, res) => {
    res.send('Landing Page');
});

app.get('/signin', (req, res) => {
    res.send('you are signed in!');
});

app.post('/login', async (req, res) => {

    const { email, password } = req.body
    console.log( email, password );

    try {
        // Query the customers table
        const userQuery = 'SELECT * FROM users WHERE email = $1 AND password = $2';
        const userResult = await pool.query(userQuery, [email, password]);
    
        if (userResult.rows.length > 0) {
          // User is a customer
          res.json({ success: true, userType: 'customer' });
          return;
        }
    
        // Query the mechanics table
        const mechanicQuery = 'SELECT * FROM mechanics WHERE email = $1 AND password = $2';
        const mechanicResult = await pool.query(mechanicQuery, [email, password]);
    
        if (mechanicResult.rows.length > 0) {
          // User is a mechanic
          res.json({ success: true, userType: 'mechanic' });
          return;
        }
    
        // User not found in either table
        res.json({ success: false });
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, error: 'An error occurred during login' });
      }
    });


  
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
