import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import CartPage from './pages/CartPage';
// import Orders from './pages/Orders';
import Orders from "./components/Orders";
import AuthProvider from './auth/AuthProvider';
import './index.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<App />}>
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
