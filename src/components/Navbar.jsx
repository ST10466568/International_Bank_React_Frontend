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
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
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
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login/customer">Customer Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login/employee">Employee Login</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-link nav-link text-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
