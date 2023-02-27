import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Button,
  Dropdown,
} from "react-bootstrap";
import { useCookies } from "react-cookie";
import profilePic from "../images/people.png";
import qrImg from "../images/qr.png";
import iconImg from "../images/icon.png";
import { dateFormat, formatRp } from "../utils/func";
import DetailModal from "../components/DetailModal";

const Profile = () => {
  const [cookies, setCookies] = useCookies(["users"]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sortByProduct, setSortByProduct] = useState(false);

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedTransaction(null);
  };

  const handleShowDetailModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const getUserTransactions = () => {
    const listTransaction =
      JSON.parse(localStorage.getItem("transactions")) || [];
    const filteredList = listTransaction.filter(
      (item) => item.userMail === cookies.users.email
    );
    setUserTransactions(filteredList);
  };

  useEffect(() => {
    getUserTransactions();
  }, []);

  return (
    <Container>
      <Row className="mt-5" sm={12}>
        <Col sm={5}>
          <p className="fs-4 fw-bold" style={{ color: "#613D2B" }}>
            My Profile
          </p>
          <Row sm={11}>
            <Col sm={5}>
              <img src={profilePic} alt="profile" />
            </Col>
            <Col sm={6}>
              <p className="fs-6 fw-semibold">Full Name</p>
              <p>{cookies.users?.fullname}</p>
              <p className="fs-6 fw-semibold">Email</p>
              <p>{cookies.users?.email}</p>
            </Col>
          </Row>
        </Col>
        <Col sm={7}>
          <div className="d-flex justify-content-between mb-2 align-items-center">
            <p className="fs-4 fw-bold" style={{ color: "#613D2B" }}>
              My Transaction
            </p>
            <Dropdown as={ButtonGroup}>
              <Button variant="light">
                Sortir By {sortByProduct ? "Product" : "Transaction"}
              </Button>

              <Dropdown.Toggle
                split
                variant="secondary"
                id="dropdown-split-basic"
              />

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortByProduct(false)}>
                  Transaction
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortByProduct(true)}>
                  Product
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="w-100 h-100 d-flex flex-column gap-3">
            {userTransactions.length > 0 ? (
              userTransactions.map((transaction, i) => {
                let listProduct = transaction.items;
                let randomImage = transaction.items.map((item, i) => item.image)[Math.floor(Math.random() * transaction.items.length)]
                if (sortByProduct) {
                  return listProduct.map((item, i) => {
                    return (
                      <Container
                        fluid
                        key={i}
                        className="p-3"
                        style={{
                          backgroundColor: "#F6E6DA",
                          color: "#974A4A",
                        }}
                      >
                        <Row>
                          <Col className="">
                            <img
                              className="object-fit-none "
                              src={item.image}
                              // height={180}
                              width={120}
                              alt="coffee"
                            />
                          </Col>
                          <Col sm={6} className="d-flex flex-column">
                            <p className="m-0 fw-bold fs-5">{item.title}</p>
                            <p className="m-0">
                              {dateFormat(transaction.date)}
                            </p>
                            <br />
                            <p className="m-0">Price : {item.price}</p>
                            <p className="m-0">Quantity : {item.quantity}</p>
                            <p className="fw-bold mb-0">
                              Subtotal : {formatRp(item.quantity * item.price)}
                            </p>
                            <p className="m-0">
                              Transaction ID : {transaction.id}
                            </p>
                          </Col>
                          <Col className="d-flex flex-column gap-2 justify-content-center align-items-center">
                            <img src={iconImg} height={50} alt="icon" />
                            <img src={qrImg} height={75} width={75} alt="qr" />
                            <StatusText text={transaction.stat} />
                          </Col>
                        </Row>
                      </Container>
                    );
                  });
                }

                let itemNames = transaction.items
                  .map((item) => item.title)
                  .join(", ");
                let totalPrice = 0;
                let totalQuantity = 0;

                transaction.items.map((item) => {
                  totalPrice += item.price * item.quantity;
                  totalQuantity += item.quantity;
                });
                return (
                  <Container
                    fluid
                    key={i}
                    className="p-3"
                    style={{
                      backgroundColor: "#F6E6DA",
                      color: "#974A4A",
                    }}
                  >
                    <Row>
                      <Col className="">
                        <img
                          className="object-fit-none "
                          src={randomImage}
                          // height={180}
                          width={120}
                          alt="coffee"
                        />
                      </Col>
                      <Col sm={6} className="d-flex flex-column">
                        <p className="m-0 fw-bold fs-5">{itemNames}</p>
                        <p className="m-0">{dateFormat(transaction.date)}</p>
                        <br />
                        <p className="m-0">Total Quantity : {totalQuantity}</p>
                        <p className="fw-bold">
                          Subtotal : {formatRp(totalPrice)}
                        </p>
                        <button
                          onClick={() => handleShowDetailModal(transaction)}
                          className="btn btn-light"
                        >
                          Order Detail
                        </button>
                      </Col>
                      <Col className="d-flex flex-column gap-2 justify-content-center align-items-center">
                        <img src={iconImg} height={50} alt="icon" />
                        <img src={qrImg} height={75} width={75} alt="qr" />
                        <StatusText text={transaction.stat} />
                      </Col>
                    </Row>
                  </Container>
                );
              })
            ) : (
              <Container fluid>
                <p>No transaction yet</p>
              </Container>
            )}
          </div>
        </Col>
      </Row>
      <DetailModal
        show={showDetailModal}
        handleClose={handleCloseModal}
        detailItem={selectedTransaction}
      />
    </Container>
  );
};

const StatusText = ({ text }) => {
  switch (text) {
    case "waiting":
      return (
        <p
          className="alert alert-warning py-1 w-100 text-center"
          role={"alert"}
        >
          Waiting Approve
        </p>
      );
    case "cancel":
      return (
        <p className="alert alert-danger py-1 w-100 text-center" role={"alert"}>
          Cancel
        </p>
      );
    case "success":
      return (
        <p
          className="alert alert-success py-1 w-100 text-center"
          role={"alert"}
        >
          Success
        </p>
      );
    case "ontheway":
      return (
        <p className="alert alert-info py-1 w-100 text-center" role={"alert"}>
          On The Way
        </p>
      );

    default:
      return <p>{text}</p>;
  }
};

export default Profile;
