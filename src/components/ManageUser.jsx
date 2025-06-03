import React, { useEffect, useState } from 'react';
import api from '../services/api';

const initialFormState = {
  username: '',
  id: '',
  name: '',
  surname: '',
  email: '',
  idNumber: '',
  role: 'Customer',
  password: ''
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editing, setEditing] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/usermanagement/users');
      setUsers(data);
    } catch (err) {
      const errorDetail = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      const status = err.response?.status ? ` (Status ${err.response.status})` : '';
      setAlert({ type: 'danger', message: `Failed to load users${status}: ${errorDetail}.` });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/usermanagement/users/${form.id}`, form);
        setAlert({ type: 'success', message: 'User updated successfully!' });
      } else {
        const { id, ...userData } = form;
        if (!userData.password) {
          setAlert({ type: 'danger', message: 'Password is required for new users.' });
          return;
        }
        if (userData.password.length < 6) {
          setAlert({ type: 'danger', message: 'Password must be at least 6 characters long.' });
          return;
        }
        if (userData.idNumber && userData.idNumber.length !== 13) {
          setAlert({ type: 'danger', message: 'ID Number must be exactly 13 characters long.' });
          return;
        }
        await api.post('/usermanagement/create-user', userData);
        setAlert({ type: 'success', message: 'User created successfully!' });
      }
      setForm(initialFormState);
      setEditing(false);
      fetchUsers();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Action failed. Please try again.'
      });
    }
  };

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      username: user.username || '',
      name: user.name,
      surname: user.surname,
      email: user.email,
      idNumber: user.idNumber,
      role: user.role || 'Customer',
      password: ''
    });
    setEditing(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/usermanagement/users/${userId}`);
      setAlert({ type: 'success', message: 'User deleted successfully!' });
      fetchUsers();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to delete user. Please try again.'
      });
    }
  };

  return (
    <div className="container my-5">
      <h2>Manage Users</h2>
      {alert.message && (
        <div className={`alert alert-${alert.type}`}>{alert.message}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
        <div className="col-md-2">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              name="surname"
              placeholder="Surname"
              className="form-control"
              value={form.surname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              name="idNumber"
              placeholder="ID Number"
              className="form-control"
              value={form.idNumber}
              onChange={handleChange}
              required
            />
          </div>       

        {!editing && (
          
            <div className="col-md-2">
              <input
                type="password"
                name="password"
                placeholder="Password (for new user)"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>          
        )}
        </div>
        <div className="row g-2 mt-2">
          <div className="col-md-3">
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="Customer">Customer</option>
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-success">
              {editing ? 'Update User' : 'Create User'}
            </button>
            {editing && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditing(false);
                  setForm(initialFormState);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <h3>Users List</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Name</th>
            <th>Surname</th>
            <th>ID Number</th>
            <th>Role</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.surname}</td>
              <td>{u.idNumber}</td>
              <td>{u.role}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleEdit(u)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;