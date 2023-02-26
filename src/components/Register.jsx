import React, { useState } from "react";
import { Modal, Button, Form, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const Register = ({ show, closeRegister, handleToLogin }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullname: "",
    address: "",
    postCode: ""
  });

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : []
    users = [...users, form];
    localStorage.setItem('users', JSON.stringify(users))
    Swal.fire({
      html: "<div class='alert alert-success' role='alert'>Register Success</div>",
      timer: 1000,
      showConfirmButton: false,
      position: 'top',
      background: '#d1e7dd',
    }).then(() => {
      closeRegister()
    })
  }

  return (
    <Modal show={show} onHide={closeRegister}>
      <Modal.Body className="py-4">
        <p
          className="h4 py-3 font-weight-bold"
          style={{ color: "#613D2B", fontWeight: "bold" }}
        >
          REGISTER
        </p>
        <Form onSubmit={onSubmitHandler}>
          <Row>
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
                name="fullname"
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
                placeholder="Address"
                name="address"
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
                placeholder="Post Code"
                name="postCode"
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
