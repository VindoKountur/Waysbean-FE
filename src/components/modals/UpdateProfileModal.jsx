import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row } from "react-bootstrap";
import { FaSyncAlt } from "react-icons/fa";
import noAvatar from "../../images/noavatar.png";
import { useMutation } from "react-query";
import { IMG_PATH } from "../../utils/const";
import { API } from "../../config/api";
import Swal from "sweetalert2";

const UpdateProfile = ({ show, closeModal, user, refetch }) => {
  const initState = {
    name: user.name,
    email: user.email,
    phone: user.profile.phone,
    photo: user.profile.photo,
  };
  const initPreview =
    initState.photo === "" ? noAvatar : IMG_PATH + initState.photo;
  const [form, setForm] = useState(initState);
  const [previewImage, setPreviewImage] = useState(initPreview);

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnPhotoChange = (e) => {
    setForm({
      ...form,
      photo: e.target.files[0],
    });
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleCloseModal = () => {
    closeModal();
    setForm(initState);
    setPreviewImage(initPreview);
  };

  const handleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      let isUpdating = false;
      if (form.name !== initState.name || form.email !== initState.email) {
        const userUpdate = {
          name: form.name,
          email: form.email,
        };
        const res = await API.patch("user", userUpdate);
        console.log(res);
        isUpdating = true;
      }

      if (form.photo !== initState.photo || form.phone !== initState.phone) {
        const formData = new FormData();
        formData.set("phone", form.phone);
        formData.set("photo", form.photo);
        const res = await API.patch("/profile", formData, config);
        console.log(res);
        isUpdating = true;
      }

      if (isUpdating) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          refetch();
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseModal();
    }
  });
  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Body className="py-4">
        <p className="h4 py-3 font-weight-bold">Update Profile</p>
        <Row>
          <Form onSubmit={(e) => handleOnSubmit.mutate(e)}>
            <Form.Group className="d-flex justify-items-center align-items-center">
              <label
                htmlFor="photo"
                role={"button"}
                title="Change Photo"
                className="mx-auto position-relative pe-2"
              >
                <img src={previewImage} height="150" alt={"Profile"} />
                <FaSyncAlt className="position-absolute bottom-0 end-0" />
              </label>
              <Form.Control
                hidden
                type="file"
                name="photo"
                id="photo"
                onChange={(e) => handleOnPhotoChange(e)}
              ></Form.Control>
            </Form.Group>
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
                type="email"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleOnChange}
                className="py-2"
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Control
                type="phone"
                placeholder="Phone"
                name="phone"
                value={form.phone}
                onChange={handleOnChange}
                className="py-2"
              />
            </Form.Group>
            <Form.Group>
              <Button type="submit" className="w-100 py-2">
                Confirm Update
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
          </Form>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProfile;
