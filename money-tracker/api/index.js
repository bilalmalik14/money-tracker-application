const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/Transaction');

const app = express();
const port = 4040;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(error => console.error('MongoDB connection failed:', error));

app.get('/api/test', (req, res) => {
  res.send("test ok");  // Send plain text response
});

app.post('/api/transaction', async (req, res) => {
  console.log("Received POST request:", req.body); // Log incoming request data

  const { name, description, datetime, price } = req.body;

  if (!name || !description || !datetime || price == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const transaction = await Transaction.create({ name, description, datetime, price });
    console.log("Transaction created successfully:", transaction);
    res.status(201).json(transaction);
  } catch (error) {
    console.error("Transaction creation failed:", error);
    res.status(500).json({ message: "Failed to create transaction", error: error.message });
  }
});

app.delete('/api/transactions', async (req, res) => {
  try {
    await Transaction.deleteMany({}); // Deletes all transactions
    res.json({ success: true, message: "All transactions have been cleared!" });
  } catch (error) {
    console.error("Error clearing transactions:", error);
    res.status(500).json({ message: "Failed to clear transactions" });
  }
});



app.get('/api/transactions', async (req, res) => {
  try {
    console.log("Fetching transactions...");
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
