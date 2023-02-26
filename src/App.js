import "./App.css";
import React, { useState, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DetailProduct from "./pages/DetailProduct";
import { CookiesProvider } from "react-cookie";

import { Container } from "react-bootstrap";
import AdminDashboard from "./pages/AdminDashboard";
import AdminListProduct from "./pages/AdminListProduct";
import AdminAddProduct from "./pages/AdminAddProduct";
import Profile from "./pages/Profile";
import AdminUpdateProduct from "./pages/AdminUpdateProduct";
import Cart from "./pages/Cart";
import { AdminRoute, UserRoute } from "./components/PrivateRoutes";

function App() {
  return (
    <CookiesProvider>
      <Navbar />
      <Container className="px-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detailproduct/:id" element={<DetailProduct />} />

          {/* ADMIN */}
          <Route path="/" element={<AdminRoute />}>
            <Route path="/admin/" element={<AdminDashboard />} />
            <Route path="/admin/product" element={<AdminListProduct />} />
            <Route path="/admin/add" element={<AdminAddProduct />} />
            <Route path="/admin/update/:id" element={<AdminUpdateProduct />} />
          </Route>

          {/* USER */}
          <Route path="/" element={<UserRoute />}>
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/cart" element={<Cart />} />
          </Route>
        </Routes>
      </Container>
    </CookiesProvider>
  );
}

export default App;
