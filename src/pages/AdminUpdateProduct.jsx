import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from 'react-router-dom'
import attachmentIcon from "../images/file.png";

const AdminUpdateProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [productIndex, setProductIndex] = useState(null)
  const [product, setProduct] = useState({
    title: "",
    stock: 0,
    price: 0,
    description: "",
    image: '',
  });

  const handleOnChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileOnChange = (e) => {
    // let fileUrl = URL.createObjectURL(e.target.files[0]);
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
    products[productIndex] = fixedProduct
    localStorage.setItem("products", JSON.stringify(products));
    navigate('/admin/product')
  };

  const getProduct = () => {
    let products = JSON.parse(localStorage.getItem('products')) || []
    let index = products.findIndex((value) => value.id == id)
    setProductIndex(index)
    setProduct({
      ...products[index]
    })
  }
  
  useEffect(() => {
    getProduct()
  }, [])
  
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
                  name="title"
                  value={product.title}
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
                  type="text"
                  placeholder="Stock"
                  name="stock"
                  value={product.stock}
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
                  type="text"
                  placeholder="Price"
                  name="price"
                  value={product.price}
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
                  Update Product
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

export default AdminUpdateProduct;
