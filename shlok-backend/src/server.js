require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const connectDB = require('./config/db');
const shlokRoutes = require('./routes/shlokRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors()); // <-- add this
app.use(express.json());

// Middleware
app.use(express.json());

// routes

app.use('/api/shloks',shlokRoutes);

// Example route
app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => {
  console.log(` Server started on port ${PORT}`);
});
