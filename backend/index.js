const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();

const UserRoutes = require('./routes/UserRoutes');

const app = express();

app.use(express.json());

/* Solve cors problem */
app.use(cors({ credentials: true, origin: `${process.env.URL}` }));

/* Public folder */
app.use(express.static('public'));

/* Routes */
app.use('/users', UserRoutes);

app.listen(process.env.PORT);