import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0); // ✅ Track balance
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    calculateBalance(); // ✅ Recalculate balance when transactions update
  }, [transactions]);

  async function fetchTransactions() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/transactions`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
      calculateBalance(data); // ✅ Set balance on fetch
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }

  function calculateBalance(transactionsList = transactions) {
    const total = transactionsList.reduce((acc, transaction) => acc + transaction.price, 0);
    setBalance(total); // ✅ Update balance state
  }

  async function addNewTransaction(event) {
    event.preventDefault();
    const firstSpaceIndex = name.indexOf(' ');
    if (firstSpaceIndex === -1) {
      alert("Please enter the price and name in the format '+200 new tv'");
      return;
    }

    const price = parseFloat(name.substring(0, firstSpaceIndex));
    const itemName = name.substring(firstSpaceIndex + 1);

    const newTransaction = { name: itemName, price, datetime, description };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) throw new Error('Failed to add transaction');

      const addedTransaction = await response.json();
      setTransactions([...transactions, addedTransaction]);

      setBalance(balance + price); // ✅ Update balance immediately

      // Clear input fields
      setName('');
      setDatetime('');
      setDescription('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  }

  // ✅ Fix: Clear Transactions & Reset Balance
  async function clearTransactions() {
    if (!window.confirm("Are you sure you want to delete all transactions?")) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/transactions`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to clear transactions');

      setTransactions([]); // ✅ Remove transactions from UI immediately
      setBalance(0); // ✅ Reset balance to $0
    } catch (error) {
      console.error('Error clearing transactions:', error);
    }
  }

  return (
    <main>
      <h1>
        ${balance}
        <span>.00</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Price + Name"
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={e => setDatetime(e.target.value)}
          />
        </div>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="description"
        />
        <button type="submit">Add a New Transaction!</button>
      </form>

      {/* ✅ Clear Transactions Button */}
      <button className="clear-btn" onClick={clearTransactions}>
        Clear Transaction History
      </button>

      <div className="transactions">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div key={transaction._id} className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={`price ${transaction.price >= 0 ? 'green' : 'red'}`}>
                  {transaction.price >= 0 ? `+$${transaction.price}` : `-$${transaction.price}`}
                </div>
                <div className="datetime">{new Date(transaction.datetime).toLocaleString()}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-transactions">No Transactions Yet.</p>
        )}
      </div>
    </main>
  );
}

export default App;
