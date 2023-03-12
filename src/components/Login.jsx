import React, { useState, useContext } from "react";
import { Modal, Button, Form, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useMutation } from 'react-query'
import { API, setAuthToken } from "../config/api"
import { UserContext, USER_ACTION_TYPE } from "../context/userContext"
import Swal from "sweetalert2";

const Login = ({ show, closeLoginFunc, handleToRegister }) => {
  const [cookies, setCookie] = useCookies(["users", "token"]);
  const [state, dispatch] = useContext(UserContext)
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  

  const handleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
  
      const { data : {data} } = await API.post("/login", form)

      dispatch({
        type: USER_ACTION_TYPE.LOGIN_SUCCESS,
        payload: data,
      })

      setAuthToken(cookies.token)

      Swal.fire({
        icon:'success',
        title: 'Login Successful',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        closeLoginFunc();
        if (data.role === "admin") {
          navigate("/admin/");
        } else {
          navigate("/");
        } 
      })


      // let users = localStorage.getItem("users")
      //   ? JSON.parse(localStorage.getItem("users"))
      //   : [];
      // const checkUser = users.find(
      //   (user) => user.email == form.email && user.password == form.password
      // );
      // if (checkUser === undefined) {
      //   return
      // }
      // setCookie("users", checkUser, { path: "/" });
      // closeLoginFunc();
      // if (checkUser.email === "admin@mail.com") {
      //   navigate('/admin/')
      //   window.location.reload()
      // } else {
      //   window.location.reload()
      // }
      
    } catch (error) {
      console.log(error)
    }
  });
  return (
    <Modal show={show} onHide={closeLoginFunc}>
      <Modal.Body className="py-4">
        <p className="h4 py-3 font-weight-bold" style={{ color: "#613D2B" }}>
          LOGIN
        </p>
        <Row>
          <Form onSubmit={(e) => handleOnSubmit.mutate(e)}>
            <Form.Group className="my-3">
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleOnChange}
                className="py-2"
                style={{
                  backgroundColor: "#613D2B40",
                  border: "2px solid #613D2B",
                }}
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleOnChange}
                className="py-2"
                style={{
                  backgroundColor: "#613D2B40",
                  border: "2px solid #613D2B",
                }}
              />
            </Form.Group>
            <Form.Group>
              <Button
                type="submit"
                className="w-100 py-2"
                style={{ backgroundColor: "#613D2B" }}
              >
                Login
              </Button>
            </Form.Group>
            <div className="mt-2">
              <p className="text-center">
                Don't have an account? Klik{" "}
                <button
                  onClick={handleToRegister}
                  type="button"
                  className="border-0 bg-transparent"
                  style={{ fontWeight: "bold" }}
                >
                  Here
                </button>
              </p>
            </div>
          </Form>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

Login.propTypes = {
  show: PropTypes.bool.isRequired,
  closeLoginFunc: PropTypes.func.isRequired,
  handleToRegister: PropTypes.func.isRequired,
};

export default Login;
