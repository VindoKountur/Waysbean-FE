import React, { useState } from "react";
import { Modal, Button, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import Swal from "sweetalert2";

import { API } from "../../../config/api";

const UpdateAddress = ({ show, closeModal, data, refetch }) => {
  const initState = {
    id: data.id,
    name: data.name,
    phone: data.phone,
    address: data.address,
    postCode: data.post_code,
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
      // return console.log(form)
      const {
        data: { data },
      } = await API.patch("/address/" + form.id, form);
      console.log(data);

      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseModal();
    }
  });

  const handleDelete = useMutation(async () => {
    const { value } = await Swal.fire({
      title: "Are you sure?",
      text: `You will delete address ${data.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (value) {
      const res = await API.delete("/address/" + data.id);
      console.log(res);
      handleCloseModal();
      refetch();
    }
  });

  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Body className="py-4">
        <p className="h4 py-3 font-weight-bold">Update Address</p>
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
            <Form.Group className="d-flex gap-2">
              <Button type="submit" className="w-100 py-2">
                Save
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={handleCloseModal}
                className="w-100 py-2"
              >
                Cancel
              </Button>
            </Form.Group>
            <Form.Group className="mt-2 text-center">
              <p
                role={"button"}
                className="text-decoration-underline"
                onClick={() => handleDelete.mutate()}
              >
                Delete
              </p>
            </Form.Group>
          </Form>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateAddress;
