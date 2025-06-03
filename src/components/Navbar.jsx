import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-white border-bottom shadow-sm mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/">International Bank</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left-aligned navigation items */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"> {/* Use me-auto to push subsequent items to the right */}
            {user && role === 'Customer' && (
              <li className="nav-item">
                <Link className="nav-link" to="/payment">Payment</Link>
              </li>
            )}
            {user && role === 'Employee' && (
              <li className="nav-item">
                <Link className="nav-link" to="/employee">Verify Transactions</Link>
              </li>
            )}
            {user && role === 'Employee' && (
              <li className="nav-item">
                <Link className="nav-link" to="/manage-users">Manage Users</Link>
              </li>
            )}
            {user && role === 'Admin' && ( // Show User Management link for Admin
              <li className="nav-item">
                <Link className="nav-link" to="/admin/user-management">User Management</Link>
              </li>
            )}
            {!user && ( // Show login links only if not logged in
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login/customer">Customer Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login/employee">Employee Login</Link>
                </li>
              </>
            )}
          </ul>

          {/* Right-aligned logout button */}
          {user && ( // Show logout only if logged in
            <ul className="navbar-nav"> {/* This ul will be pushed to the right */}
              <li className="nav-item">
                <button className="btn btn-link nav-link text-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          )}
          {/* The <ul> for the logout button is conditionally rendered above */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
