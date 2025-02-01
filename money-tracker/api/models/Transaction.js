const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  datetime: { type: Date, required: true },
  price: { type: Number, required: true }  // Ensure this field is correctly defined
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
