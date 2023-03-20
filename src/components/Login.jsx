import React, { useState, useContext } from "react";
import { Modal, Button, Form, Row, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import Swal from "sweetalert2";

import { UserContext, USER_ACTION_TYPE } from "../context/userContext";
import { API, setAuthToken } from "../config/api";

const Login = ({ show, closeLoginFunc, handleToRegister }) => {
  const [cookies] = useCookies(["users", "token"]);
  const [_, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
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
    setIsLoading(true);
    try {
      e.preventDefault();

      const {
        data: { data },
      } = await API.post("/login", form);

      dispatch({
        type: USER_ACTION_TYPE.LOGIN_SUCCESS,
        payload: data,
      });

      setAuthToken(cookies.token);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        closeLoginFunc();
        if (data.role === "admin") {
          navigate("/admin/");
        } else {
          navigate("/");
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
    } finally {
      setIsLoading(false);
    }
  });
  return (
    <Modal show={show} onHide={closeLoginFunc}>
      <Modal.Body className="py-4">
        <p className="h4 py-3 font-weight-bold" style={{ color: "#613D2B" }}>
          LOGIN
        </p>
        <Row>
          <div>{message && message}</div>
          <Form onSubmit={(e) => handleOnSubmit.mutate(e)}>
            <Form.Group className="my-3">
              <Form.Control
                type="email"
                required
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
                required
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
                disabled={isLoading}
                type="submit"
                className="w-100 py-2"
                style={{ backgroundColor: "#613D2B" }}
              >
                {isLoading ? "Logging in..." : "Login"}
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
