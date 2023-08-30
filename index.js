// Import required packages
const express = require('express');
const cors = require('cors');
const connectToMongoDB = require('./db/db');

require('dotenv').config();

// Create an Express app
const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: '*', // Replace with your frontend's URL
  credentials: true,
}));

// Connect to MongoDB
connectToMongoDB();

const contactRoutes = require('./routes/contactRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api', contactRoutes); // For getting all contacts
app.use('/api', messageRoutes); // For getting message of specific contact

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
