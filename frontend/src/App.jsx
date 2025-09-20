import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MonthlySummary from './pages/MonthlySummary';

function App() {
  // Mock user state - replace with actual authentication
  const [user, setUser] = useState({
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    plan: "free", // or "premium"
    joinDate: "2025-01-15",
    tasksCount: 7,
    maxTasks: 10,
    isAuthenticated: true
  });

  // Mock authentication check
  const isAuthenticated = user?.isAuthenticated || false;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path='/' 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path='/login' 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path='/register' 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
        />

        {/* Protected Routes */}
        <Route 
          path='/dashboard' 
          element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />} 
        />

        <Route 
          path='/profile' 
          element={isAuthenticated ? <Profile user={user} /> : <Navigate to="/login" />} 
        />

        <Route
          path='/monthly-summary'
          element={isAuthenticated ? <MonthlySummary user={user} /> : <Navigate to="/login" />}
        />


        {/* Catch all route */}
        <Route 
          path='*' 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;