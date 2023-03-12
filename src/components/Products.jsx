import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, InputGroup, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { formatRp } from "../utils/func";
import { useQuery } from "react-query";
import { API } from "../config/api";
import { IMG_PATH } from "../utils/const";

const Products = () => {
  return (
    <Container className="mt-4 pb-5">
      <Cards />
    </Container>
  );
};

const Cards = () => {
  const [searchName, setSearchName] = useState("");
  let { data: products } = useQuery(
    ["productsChace", searchName],
    async ({ queryKey }) => {
      const [_key, name] = queryKey;
      let str = "/products";
      if (name) {
        str += `?name=${name}`;
      }
      const res = await API.get(str);
      return res.data.data;
    }
  );
  const navigate = useNavigate();

  // return
  return (
    <>
      <Row>
        <Col>
          <InputGroup className="mb-3 w-25">
            <Form.Control
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search product name"
              aria-label="name"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        {products?.length === 0 ? (
          <div className="text-center mt-5">
            <h3>No products found</h3>
          </div>
        ) : (
          <>
            {products?.map((product, i) => (
              <Col key={product.id} sm={6} md={3} className="mb-3">
                <Card
                  onClick={() => navigate(`/detailproduct/${product.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Img
                    variant="top"
                    src={IMG_PATH + product.photo}
                    alt={product.images}
                  />
                  <div className="p-4" style={{ backgroundColor: "#F6E6DA" }}>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{formatRp(product.price)}</Card.Text>
                    <Card.Text>Stock : {product.stock}</Card.Text>
                  </div>
                </Card>
              </Col>
            ))}
          </>
        )}
      </Row>
    </>
  );
};

export default Products;
