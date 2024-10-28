const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectToMongo();

const app = express(); // Declare app once
const port = 5000;

app.use(cors()); // Allow CORS for all origins
app.use(express.json()); // Middleware to parse JSON requests

// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNotebook backend is listening on port http://localhost:${port}`);
});
