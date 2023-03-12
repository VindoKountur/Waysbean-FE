import React, { useState } from "react";
import { Modal, Button, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";

import { API } from "../../../config/api";

const AddAddress = ({ show, closeModal, refetch }) => {
  const initState = {
    name: "",
    phone: "",
    address: "",
    postCode: "",
  };
  const [form, setForm] = useState(initState);

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseModal = () => {
    closeModal();
    setForm(initState);
  };

  const handleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      
      const { data : { data } } = await API.post('/address', form)
      console.log(data)

      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseModal();
    }
  });
  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Body className="py-4">
        <p className="h4 py-3 font-weight-bold">Add New Address</p>
        <Row>
          <Form onSubmit={(e) => handleOnSubmit.mutate(e)}>
            <Form.Group className="my-3">
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={form.name}
                onChange={handleOnChange}
                className="py-2"
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Control
                type="text"
                placeholder="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleOnChange}
                className="py-2"
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Control
                type="text"
                placeholder="Address"
                name="address"
                value={form.address}
                onChange={handleOnChange}
                className="py-2"
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Control
                type="text"
                placeholder="Post Code"
                name="postCode"
                value={form.postCode}
                onChange={handleOnChange}
                className="py-2"
              />
            </Form.Group>
            <Form.Group>
              <Button type="submit" className="w-100 py-2">
                Save
              </Button>
            </Form.Group>
            <Form.Group className="mt-2">
              <Button
                variant="danger"
                type="button"
                onClick={handleCloseModal}
                className="w-100 py-2"
              >
                Cancel
              </Button>
            </Form.Group>
            {/* <div className="mt-2">
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
            </div> */}
          </Form>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default AddAddress;
