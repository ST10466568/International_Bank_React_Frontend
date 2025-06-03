import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLogin from './components/CustomerLogin';
import EmployeeLogin from './components/EmployeeLogin';
import CustomerPayment from './components/CustomerPayment';
import EmployeeDashboard from './components/EmployeeDashboard';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import CreateCustomer from './components/CreateCustomer';
import ManageUsers from './components/ManageUser';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login/customer" replace />} />
        <Route path="/login/customer" element={<Layout><CustomerLogin /></Layout>} />
        <Route path="/login/employee" element={<Layout><EmployeeLogin /></Layout>} />

        {/* Customer Routes */}
        <Route path="/payment" element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <Layout><CustomerPayment /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />

      <Route path="/create-customer" element={
        <ProtectedRoute allowedRoles={['Employee']}>
          <Layout><CreateCustomer /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/manage-users" element={
      <ProtectedRoute allowedRoles={['Employee']}>
        <Layout>
          <ManageUsers />
        </Layout>
      </ProtectedRoute>
      } />


        {/* Employee Routes */}
        <Route path="/employee" element={
          <ProtectedRoute allowedRoles={['Employee']}>
            <Layout><EmployeeDashboard /></Layout>
          </ProtectedRoute>
          } />

        {/* Fallback Route for 404 Not Found */}
        <Route path="*" element={<Layout><div><h2>404 - Page Not Found</h2><p>The page you are looking for does not exist.</p></div></Layout>} />

        </Routes>
      </Router>
  );
};

export default App;