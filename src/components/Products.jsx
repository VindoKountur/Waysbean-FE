import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { formatRp } from "../utils/func";

const Products = () => {
  return (
    <Container className="mt-4 pb-5">
      <Row>
        <Cards />
      </Row>
    </Container>
  );
};

const Cards = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const getProducts = () => {
    // fetch('/products.json')
    // .then((res) => res.json())
    // .then((json) => setProducts(json));
    let data = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return products.map((product, i) => (
    <Col key={product.id}>
      <Card
        onClick={() => navigate(`/detailproduct/${product.id}`)}
        style={{ cursor: "pointer" }}
      >
        <Card.Img variant="top" src={product.image} alt={product.images} />
        <div className="p-4" style={{ backgroundColor: "#F6E6DA" }}>
          <Card.Title>{product.title}</Card.Title>
          <Card.Text>{formatRp(product.price)}</Card.Text>
          <Card.Text>Stock : {product.stock}</Card.Text>
        </div>
      </Card>
    </Col>
  ));
};

export default Products;
