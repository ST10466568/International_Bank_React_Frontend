import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, role, logout } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'Customer') {
      navigate('/');
    }

    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transaction');
        const customerTransactions = response.data.filter(tx => tx.isVerified); // show only verified
        setTransactions(customerTransactions);
      } catch (err) {
        setError('Could not load transactions.');
      }
    };

    fetchTransactions();
  }, [role, navigate]);

  return (
    <div className="transactions-page-container">
      <div className="transactions-container">
        <h2 className="transactions-header">Your Verified Transactions</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {transactions.length === 0 ? (
          <div className="alert alert-info">You have no verified transactions.</div>
        ) : (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Recipient Name</th>
                <th>Recipient Account</th>
                <th>Swift Code</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.currency}</td>
                  <td>{tx.recipientAccountName}</td>
                  <td>{tx.recipientAccountNumber}</td>
                  <td>{tx.recipientSwiftCode}</td>
                  <td>{new Date(tx.createdDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="button-group mt-4">
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;