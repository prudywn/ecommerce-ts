import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';
import ProductsPage from './pages/ProductsPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import OrderPage from './pages/OrderPage';
import AdminDashboard from './components/AdminDashoard';
import ForYouPage from './pages/ForYouPage';
import PurchasePage from './pages/PurchasePage';
import ThemeSwitcher from './components/ThemeSwitcher';
import './App.css'

const App: React.FC = () => {
  
  return (
    <Router>
      <div className="min-h-screen ">
      <AuthProvider>
        <Navbar />
        <ThemeSwitcher />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/foryou" element={<ForYouPage />} />
          <Route path="/purchase" element={<PurchasePage />} />
        </Routes>
        </AuthProvider>
      </div>
    </Router>
  );
};

export default App;
