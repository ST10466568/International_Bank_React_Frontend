import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EmployeeLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await api.post('/auth/login', form);

      if (data.token) {
        login({
          token: data.token,
          user: data.name,
          role: data.role
        });
        navigate('/employee');
      } else {
        setError('Login failed: missing token.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        <h2 className="login-header">Employee Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input type="email" name="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required />
            <label htmlFor="email">Email</label>
          </div>

          <div className="form-floating mb-4">
            <input type="password" name="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} required />
            <label htmlFor="password">Password</label>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">Login</button>
            <a href="/login/customer" className="btn btn-secondary">Customer Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;