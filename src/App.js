import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DetailProduct from "./pages/DetailProduct";
import { useCookies } from "react-cookie";

import { Container } from "react-bootstrap";
import AdminDashboard from "./pages/AdminDashboard";
import AdminListProduct from "./pages/AdminListProduct";
import AdminAddProduct from "./pages/AdminAddProduct";
import Profile from "./pages/Profile";
import AdminUpdateProduct from "./pages/AdminUpdateProduct";
import Cart from "./pages/Cart";
import { AdminRoute, UserRoute } from "./components/PrivateRoutes";
import { API, setAuthToken } from "./config/api";
import { UserContext, USER_ACTION_TYPE } from "./context/userContext";

function App() {
  let navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect Auth but just when isLoading is false
    if (!isLoading) {
      if (state.isLogin === false) {
        navigate("/");
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (cookies.token) {
      setAuthToken(cookies.token);
      checkUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkUser = async () => {
    try {
      console.log("checking user...");
      const {
        data: { data },
      } = await API.get("/check-auth");
      console.log("check user success : ", data);
      let payload = data;
      payload.token = cookies.token;
      // Send data to useContext
      dispatch({
        type: USER_ACTION_TYPE.USER_SUCCESS,
        payload,
      });
      setIsLoading(false);
    } catch (error) {
      console.log("check user failed : ", error);
      dispatch({
        type: USER_ACTION_TYPE.AUTH_ERROR,
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? null : (
        <>
          <Navbar />
          <Container className="px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detailproduct/:id" element={<DetailProduct />} />
              {/* ADMIN */}
              <Route path="/" element={<AdminRoute />}>
                <Route path="/admin/" element={<AdminDashboard />} />
                <Route path="/admin/product" element={<AdminListProduct />} />
                <Route path="/admin/add" element={<AdminAddProduct />} />
                <Route
                  path="/admin/update/:id"
                  element={<AdminUpdateProduct />}
                />
              </Route>

              {/* USER */}
              <Route path="/" element={<UserRoute />}>
                <Route path="/user/profile" element={<Profile />} />
                <Route path="/user/cart" element={<Cart />} />
              </Route>
            </Routes>
          </Container>
        </>
      )}
    </div>
  );
}

export default App;
