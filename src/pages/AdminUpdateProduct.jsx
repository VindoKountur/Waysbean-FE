import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useMutation } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import attachmentIcon from "../images/file.png";
import { API } from "../config/api";
import { IMG_PATH } from "../utils/const";

const AdminUpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const resetValue = {
    name: "",
    stock: 0,
    price: 0,
    description: "",
    photo: "",
  };
  const [product, setProduct] = useState(resetValue);
  const [imagePreview, setImagePreview] = useState(false);
  const [photoName, setPhotoName] = useState("Choose new photo");

  const handleOnChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileOnChange = (e) => {
    let fileUrl = URL.createObjectURL(e.target.files[0]);
    setPhotoName(e.target.files[0].name);
    setProduct({
      ...product,
      photo: e.target.files[0],
    });
    setImagePreview(fileUrl);
  };

  const getProduct = async () => {
    try {
      const {
        data: { data },
      } = await API.get(`/product/${id}`);
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      const fixedProduct = {
        ...product,
        price: parseInt(product.price),
        stock: parseInt(product.stock),
      };
      const formData = new FormData();
      formData.set("name", fixedProduct.name);
      formData.set("price", fixedProduct.price);
      formData.set("stock", fixedProduct.stock);
      formData.set("description", fixedProduct.description);
      formData.set("photo", fixedProduct.photo);

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };
      await API.patch("/product/"+id, formData, config);

      Swal.fire({
        text: "Product updated",
        timer: 1000,
        icon: "success",
        showConfirmButton: false,
      }).then(() => {
        navigate('/admin/product')
      });
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <Container className="p-4">
      <Row sm={10} className="d-flex justify-items-center align-items-center">
        <Col sm={5}>
          <p
            className="h4 py-1 font-weight-bold"
            style={{ color: "#613D2B", fontWeight: "bold" }}
          >
            Add Product
          </p>
          <Form onSubmit={(e) => handleOnSubmit.mutate(e)}>
            <Row>
              <Form.Group className="my-3">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={product.name}
                  name="name"
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
                  type="number"
                  placeholder="Stock"
                  value={product.stock === 0 ? "" : product.stock}
                  name="stock"
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
                  type="number"
                  placeholder="Price"
                  value={product.price === 0 ? "" : product.price}
                  name="price"
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
                  as={"textarea"}
                  rows={4}
                  placeholder="Description"
                  name="description"
                  value={product.description}
                  onChange={handleOnChange}
                  className="py-2"
                  style={{
                    backgroundColor: "#613D2B40",
                    border: "2px solid #613D2B",
                  }}
                />
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label
                  htmlFor="upload-image"
                  className="p-2 rounded w-100 d-flex justify-content-between align-items-center"
                  style={{
                    backgroundColor: "#613D2B40",
                    border: "2px solid #613D2B",
                  }}
                >
                  {photoName}
                  <span>
                    <img className="px-2" src={attachmentIcon} alt="file" />
                  </span>
                </Form.Label>
                <Form.Control
                  hidden
                  id="upload-image"
                  onChange={handleFileOnChange}
                  type="file"
                  placeholder="Price"
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
                  Add Product
                </Button>
              </Form.Group>
            </Row>
          </Form>
        </Col>
        <Col sm={5} className="mx-auto">
          {product.photo && (
            <img
              src={
                imagePreview === false ? IMG_PATH + product.photo : imagePreview
              }
              alt={product.name}
              height={500}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminUpdateProduct;
