import React, { useState } from 'react';
import api from '../services/api'; // Axios instance with JWT token
/* global bootstrap */ // Add this line to inform ESLint about the global bootstrap object

const CustomerPayment = () => {
  const [form, setForm] = useState({
    amount: '',
    currency: '',
    swiftCode: '',
    recipientAccountName: '',
    recipientAccountNumber: '',
    recipientSwiftCode: ''
  });

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ type: '', message: '' }); // Clear previous alerts

    try {
      const payload = {
        amount: parseFloat(form.amount),
        currency: form.currency,
        swiftCode: form.swiftCode,
        recipientAccountName: form.recipientAccountName,
        recipientAccountNumber: form.recipientAccountNumber,
        recipientSwiftCode: form.recipientSwiftCode
      };

      const { data } = await api.post('/payment/pay', payload);
      setAlert({ type: 'success', message: data.message });

      setForm({
        amount: '',
        currency: '',
        swiftCode: '',
        recipientAccountName: '',
        recipientAccountNumber: '',
        recipientSwiftCode: ''
      });

      // Manually close Bootstrap modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('recipientModal'));
      modal?.hide();
    } catch (error) {
      let message = 'Payment failed. Please try again.';
    
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        message = Object.values(errors).flat().join(' ');
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
    
      setAlert({ type: 'danger', message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="transactions-page-container">
      <div className="transactions-container">
        <h2 className="transactions-header">Make a Payment</h2>

        {alert.message && (
          <div className={`alert alert-${alert.type} transaction-alert`}>
            {alert.message}
          </div>
        )}

        <form className="payment-form">    
          <div className="form-floating mb-3">
            <input
              type="number"
              step="0.01"
              name="amount"
              className="form-control"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
            <label htmlFor="amount">Amount</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              name="currency"
              className="form-control"
              placeholder="Currency"
              value={form.currency}
              onChange={handleChange}
              required
            />
            <label htmlFor="currency">Currency</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              name="swiftCode"
              className="form-control"
              placeholder="SWIFT Code"
              value={form.swiftCode}
              onChange={handleChange}
              required
            />
            <label htmlFor="swiftCode">SWIFT Code</label>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#recipientModal"
              disabled={isLoading}
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>

      {/* Modal for recipient details */}
      <div className="modal fade" id="recipientModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Recipient Information</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  name="recipientAccountName"
                  className="form-control"
                  placeholder="Recipient Account Name"
                  value={form.recipientAccountName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="recipientAccountName">Recipient Account Name</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  name="recipientAccountNumber"
                  className="form-control"
                  placeholder="Recipient Account Number"
                  value={form.recipientAccountNumber}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="recipientAccountNumber">Recipient Account Number</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  name="recipientSwiftCode"
                  className="form-control"
                  placeholder="Recipient SWIFT Code"
                  value={form.recipientSwiftCode}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="recipientSwiftCode">Recipient SWIFT Code</label>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="submit" className="btn btn-success" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerPayment;