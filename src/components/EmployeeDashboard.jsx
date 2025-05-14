import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { role, logout } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'Employee') {
      navigate('/');
      return;
    }

    fetchTransactions();
  }, [role, navigate]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transaction/unverified');
      setTransactions(response.data);
    } catch (err) {
      setError('Error loading unverified transactions.');
    }
  };

  const verifyTransaction = async (id) => {
    try {
      await api.put(`/transaction/verify/${id}`);
      setSuccessMessage(`Transaction #${id} verified.`);
      fetchTransactions(); // refresh
    } catch (err) {
      setError('Verification failed.');
    }
  };

  return (
    <div className="transactions-page-container">
      <div className="transactions-container">
        <h2 className="transactions-header">Unverified Transactions</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {transactions.length === 0 ? (
          <div className="alert alert-info">No unverified transactions.</div>
        ) : (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Recipient</th>
                <th>Account</th>
                <th>SWIFT</th>
                <th>Customer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.currency}</td>
                  <td>{tx.recipientAccountName}</td>
                  <td>{tx.recipientAccountNumber}</td>
                  <td>{tx.recipientSwiftCode}</td>
                  <td>{tx.customer?.name} {tx.customer?.surname}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => verifyTransaction(tx.id)}
                    >
                      Verify
                    </button>
                  </td>
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

export default EmployeeDashboard;