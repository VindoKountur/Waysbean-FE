import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  NavDropdown,
  Nav,
  Badge,
  Navbar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import cssModule from "./Navbar.module.css";
import Login from "../components/Login";
import Register from "./Register";

import icon from "../images/icon.png";
import cart from "../images/cart.png";
import people from "../images/people.png";
import coffeeIcon from "../images/coffee.png";
import logoutIcon from "../images/logout.png";
import profileIcon from "../images/profile.png";

import { UserContext } from "../utils/UserContext";

export default function MyNavbar() {
  const [cookies, setCookies, removeCookies] = useCookies(["users", "cart"]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };
  const handleToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    removeCookies("users", { path: "/" });
    navigate("/");
    window.location.reload();
  };
  useEffect(() => {
    const loginUser = cookies.users ? cookies.users : null;
    setUser(loginUser);
  }, []);

  useEffect(() => {
    cekQuantity();
  }, [cookies.cart]);

  const cekQuantity = () => {
    let cartData = cookies.cart;
    let tmpTotal = 0;
    if (cartData) {
      cartData.map((val) => {
        tmpTotal += val.quantity;
      });
    }
    setTotalQuantity(tmpTotal);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid className="bg-light py-1 shadow px-5">
        <Navbar.Brand href={
          user?.email === "admin@mail.com" ? '/admin/' : '/'
        }>
          <img className="ms-5" src={icon} alt="Icon" height={35} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav style={{paddingRight: '150px'}} className="d-flex gap-2 align-items-center">
          {user === null ? (
                <div className="d-flex gap-3">
                  <button
                    className={`px-3 py-1 rounded ${cssModule.customBtnLogin}`}
                    onClick={() => setShowLogin(true)}
                  >
                    Login
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${cssModule.customBtnRegister}`}
                    onClick={() => setShowRegister(true)}
                  >
                    Register
                  </button>
                </div>
              ) : user.email == "admin@mail.com" ? (
                <>
                  <NavDropdown
                    title={
                      <img
                        src={people}
                        alt="orang"
                        height={40}
                        width={40}
                        style={{ objectFit: "cover" }}
                        className="rounded-pill"
                      />
                    }
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item
                      href="/admin/add"
                      className="d-flex justify-items-center align-items-center gap-2"
                    >
                      <img src={coffeeIcon} alt="coffee" height={20} />
                      <span>Add Product</span>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      href="/admin/product"
                      className="d-flex justify-items-center align-items-center gap-2"
                    >
                      <img src={coffeeIcon} alt="coffee" height={20} />
                      <span>List Product</span>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      className="d-flex justify-items-center align-items-center gap-2"
                      onClick={handleLogout}
                    >
                      <img src={logoutIcon} alt="logout" height={20} />
                      <span>Logout</span>
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <div
                    className="position-relative"
                    onClick={() => navigate("/user/cart")}
                  >
                    <img
                      src={cart}
                      alt="cart"
                      height={28}
                      style={{ cursor: "pointer" }}
                      onClick={() => cekQuantity()}
                    />
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute"
                      style={{ top: "-0.4em", right: "-0.8em", cursor: 'pointer' }}
                    >
                      {totalQuantity === 0 ? '' : totalQuantity}
                    </Badge>
                  </div>
                  <NavDropdown
                    title={
                      <img
                        src={people}
                        alt="orang"
                        height={40}
                        width={40}
                        style={{ objectFit: "cover" }}
                        className="rounded-pill"
                      />
                    }
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item
                      href="/user/profile"
                      className="d-flex justify-items-center align-items-center gap-2"
                    >
                      <img src={profileIcon} alt="coffee" height={20} />
                      <span>Profile</span>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      className="d-flex justify-items-center align-items-center gap-2"
                      onClick={handleLogout}
                    >
                      <img src={logoutIcon} alt="logout" height={20} />
                      <span>Logout</span>
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Login
        show={showLogin}
        closeLoginFunc={() => setShowLogin(false)}
        handleToRegister={handleToRegister}
      />
      <Register
        show={showRegister}
        closeRegister={() => setShowRegister(false)}
        handleToLogin={handleToLogin}
      />
    </Navbar>
  );
}
