import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import attachmentIcon from "../images/file.png";
import Swal from "sweetalert2";

const AdminAddProduct = () => {
  const resetValue = {
    title: "",
    stock: 0,
    price: 0,
    description: "",
    image: "",
  }
  const [product, setProduct] = useState(resetValue);

  const handleOnChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileOnChange = (e) => {
    // let fileUrl = URL.createObjectURL(e.target.files[0]);
    // setProduct({
    //   ...product,
    //   image: fileUrl,
    //   // image: '/images/ethiopia.png',
    // });
    let fileName = (e.target.files[0].name);
    setProduct({
      ...product,
      image: `/images/${fileName}`,
    });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const fixedProduct = {
      ...product,
      price: parseInt(product.price),
      stock: parseInt(product.stock)
    }
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let newId = products[products.length - 1]?.id + 1 || 1;
    const newProduct = { id: newId, ...fixedProduct };
    products = [...products, newProduct];
    localStorage.setItem("products", JSON.stringify(products));
    Swal.fire({
      text: "New Product Added",
      timer: 1000,
      icon: 'success',
      showConfirmButton: false,
    }).then(() => {
      setProduct(resetValue)
    })
  };
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
          <Form onSubmit={handleOnSubmit}>
            <Row>
              <Form.Group className="my-3">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={product.title}
                  name="title"
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
                  className="p-2 rounded"
                  style={{
                    backgroundColor: "#613D2B40",
                    border: "2px solid #613D2B",
                  }}
                >
                  Photo Product{" "}
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
          {product.image == "" 
          ? <p>Image Preview</p>
          : <img src={product.image} alt={"foto"} height={500} /> }
        </Col>
      </Row>
    </Container>
  );
};

export default AdminAddProduct;
