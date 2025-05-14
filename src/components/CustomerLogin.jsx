import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CustomerLogin = () => {
  

  const [form, setForm] = useState({
    username: '',
    accountNumber: '',
    password: ''
  });

  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log("🚀 Submitting login form", form);
    e.preventDefault();
    setError('');

    try {
      const { data } = await api.post('/auth/customer/login', form);

      console.log('🎯 API Login Response:', data);

      if (data.token) {
        console.log("✅ Calling login() with token:", data.token);
        login({
          
          token: data.token,
          user: data.name,
          role: data.role
        });

        console.log('✅ LOGIN triggered → token:', data.token);
        navigate('/payment');
      } else {
        setError('Login failed: Token not returned.');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        <h2 className="login-header">Customer Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-floating mb-3">
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="username">Username</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              name="accountNumber"
              className="form-control"
              placeholder="Account Number"
              value={form.accountNumber}
              onChange={handleChange}
              required
            />
            <label htmlFor="accountNumber">Account Number</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">Login</button>
            <a href="/login/employee" className="btn btn-secondary">Employee Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
