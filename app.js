const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const apiRoutes = require('./routes/api'); // Notice path change if app.js is in root

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/v1', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HealthPal Final Running on Port ${PORT}`));