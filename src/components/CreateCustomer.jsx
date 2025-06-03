import React, { useState } from 'react';
import api from '../services/api';

const CreateCustomer = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    surname: '',
    idNumber: ''
  });

  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    try {
      const { data } = await api.post('/auth/create-customer', form);
      setAlert({ type: 'success', message: data.message });

      // Clear form after successful creation
      setForm({
        username: '',
        email: '',
        password: '',
        name: '',
        surname: '',
        idNumber: ''
      });
    } catch (error) {
      console.error(error);
      setAlert({
        type: 'danger',
        message: error.response?.data?.message || 'Error creating customer.'
      });
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        <h2 className="login-header">Create Customer</h2>

        {alert.message && (
          <div className={`alert alert-${alert.type}`}>{alert.message}</div>
        )}

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
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="form-floating mb-3">
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

          <div className="form-floating mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="First Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="name">First Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              name="surname"
              className="form-control"
              placeholder="Last Name"
              value={form.surname}
              onChange={handleChange}
              required
            />
            <label htmlFor="surname">Last Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              name="idNumber"
              className="form-control"
              placeholder="ID Number"
              value={form.idNumber}
              onChange={handleChange}
              required
            />
            <label htmlFor="idNumber">ID Number</label>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">Create Customer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomer;