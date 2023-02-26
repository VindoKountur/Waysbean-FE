import React from "react";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";

import { dateFormat, formatRp } from "../utils/func";

const DetailModal = ({ show, handleClose, detailItem }) => {
  let totalPrice = 0
  let totalQuantity = 0
  return (
    detailItem && (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>Order Date : {dateFormat(detailItem.date)}</p>
          <p>Name : {detailItem.fullname}</p>
          <p>Email : {detailItem.userMail}</p>
          <p>Address : {detailItem.address}</p>
          <p>Post Code : {detailItem.postCode}</p>
          <Container className="d-flex flex-column gap-2">
            {detailItem.items?.map((product) => {
              let subTotal = product.price * product.quantity;
              totalQuantity += product.quantity
              totalPrice += subTotal
              return(
              <Row key={product.id}>
                <Col className="d-flex gap-2 bg-light p-1">
                  <img
                    src={product.image}
                    height={75}
                    alt={`Product ${product.title}`}
                  />
                  <div className="w-100">
                    <p className="m-0">{product.title}</p>
                    <p className="m-0">{formatRp(product.price)}</p>
                    <div className="d-flex justify-content-between w-100">
                      <p className="m-0">x {product.quantity}</p>
                      <p>Subtotal : {formatRp(subTotal)}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            )})}
          </Container>
          <div className="d-flex justify-content-between">
            <p>Total Quantity : {totalQuantity}</p>
            <p>Total Price : {formatRp(totalPrice)}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  );
};

export default DetailModal;
