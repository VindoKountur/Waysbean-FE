import React, { useState, useContext } from "react";
import { Modal, Button, Form, Row, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { API, setAuthToken } from "../config/api";
import { useMutation } from "react-query";
import { useCookies } from "react-cookie"
import { useNavigate } from 'react-router-dom'

import { UserContext, USER_ACTION_TYPE } from "../context/userContext";

const Register = ({ show, closeRegister, handleToLogin }) => {
  const navigate = useNavigate();
  const [_, dispatch] = useContext(UserContext)
  const [cookies] = useCookies(['token'])
  const [message, setMessage] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handlerRegister = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data: {data} } = await API.post("/register", form, config);
      dispatch({
        type: USER_ACTION_TYPE.USER_SUCCESS,
        payload: data,
      });

      setAuthToken(cookies.token)

      Swal.fire({
        icon: "success",
        text: "Register Success",
        timer: 1500,
      }).then(() => {
        closeRegister();
        if (data.role === "admin") {
          navigate("/admin/");
        } else {
          navigate("/");
          // window.location.reload();
        } 
      });
    } catch (error) {
      const alert = (
        <Alert
          variant="danger"
          className="py-2"
          role={"button"}
          onClick={() => setMessage(null)}
        >
          {error.response.data.message}
        </Alert>
      );
      setMessage(alert);
    }
  });

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal show={show} onHide={closeRegister}>
      <Modal.Body className="py-4">
        <p
          className="h4 py-3 font-weight-bold"
          style={{ color: "#613D2B", fontWeight: "bold" }}
        >
          REGISTER
        </p>
        <Form onSubmit={(e) => handlerRegister.mutate(e)}>
          <Row>
            <div>{message && message}</div>
            <Form.Group className="my-2">
              <Form.Control
                type="email"
                placeholder="Email"
                required
                name="email"
                onChange={onChangeHandler}
                className="py-2"
                style={{
                  backgroundColor: "#613D2B40",
                  border: "2px solid #613D2B",
                }}
              />
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Control
                type="password"
                required
                placeholder="Password"
                name="password"
                onChange={onChangeHandler}
                className="py-2"
                style={{
                  backgroundColor: "#613D2B40",
                  border: "2px solid #613D2B",
                }}
              />
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Control
                type="text"
                required
                placeholder="Full Name"
                name="name"
                onChange={onChangeHandler}
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
                Register
              </Button>
            </Form.Group>
            <div className="mt-2">
              <p className="text-center">
                Already have an account? Klik{" "}
                <button
                  onClick={handleToLogin}
                  type="button"
                  className="border-0 bg-transparent"
                  style={{ fontWeight: "bold" }}
                >
                  Here
                </button>
              </p>
            </div>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

Register.propTypes = {
  show: PropTypes.bool.isRequired,
  closeRegister: PropTypes.func.isRequired,
  handleToLogin: PropTypes.func.isRequired,
};

export default Register;
