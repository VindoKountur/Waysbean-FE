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
import { useQuery } from "react-query";

import DetailModal from "../components/DetailModal";
import MyProfile from "../components/profile/MyProfile";
import Loading from "../components/Loading";
import Addresses from "../components/profile/Addresses";

import iconImg from "../images/icon.png";
import qrImg from "../images/qr.png";
import { dateFormat, formatRp } from "../utils/func";
import { API } from "../config/api";
import { IMG_PATH } from '../utils/const'

const Profile = () => {
  const [cookies] = useCookies(["users"]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sortByProduct, setSortByProduct] = useState(false);

  let { data : transactions } = useQuery("transaction", async () => {
    const { data } = await API.get("/transactions-user");
    console.log(data.data);
    return data.data
  })

  const getUserInfo = async () => {
    try {
      const {
        data: { data },
      } = await API.get("/user-info");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

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
    // getUserTransactions();
    // getUserInfo();
  }, []);

  return (
    <Container>
      <Row className="mt-2" sm={12}>
        <Col sm={5}>
          <MyProfile />
          <Addresses />
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
            {transactions?.length > 0 ? (
              transactions?.map((transaction, i) => {
                let listProduct = transaction.products;
                let randomImage = transaction.products.map((item) => item.photo)[
                  Math.floor(Math.random() * transaction.products.length)
                ];
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
                              src={IMG_PATH + item.photo}
                              // height={180}
                              width={120}
                              alt="coffee"
                            />
                          </Col>
                          <Col sm={6} className="d-flex flex-column">
                            <p className="m-0 fw-bold fs-5">{item.name}</p>
                            <p className="m-0">
                              {dateFormat(transaction.created_at)}
                            </p>
                            <br />
                            <p className="m-0">Price : {item.price}</p>
                            <p className="m-0">Quantity : {item.orderQuantity}</p>
                            <p className="fw-bold mb-0">
                              Subtotal : {formatRp(item.orderQuantity * item.price)}
                            </p>
                            <p className="m-0">
                              Transaction ID : {transaction.id}
                            </p>
                          </Col>
                          <Col className="d-flex flex-column gap-2 justify-content-center align-items-center">
                            <img src={iconImg} height={50} alt="icon" />
                            <img src={qrImg} height={75} width={75} alt="qr" />
                            <StatusText text={transaction.status} />
                          </Col>
                        </Row>
                      </Container>
                    );
                  });
                }

                let itemNames = transaction.products
                  .map((item) => item.name)
                  .join(", ");
                let totalPrice = 0;
                let totalQuantity = 0;

                transaction.products.map((item) => {
                  totalPrice += item.price * item.orderQuantity;
                  totalQuantity += item.orderQuantity;
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
                          src={IMG_PATH + randomImage}
                          // height={180}
                          width={120}
                          alt="coffee"
                        />
                      </Col>
                      <Col sm={6} className="d-flex flex-column">
                        <p className="m-0 fw-bold fs-5">{itemNames}</p>
                        <p className="m-0">{dateFormat(transaction.created_at)}</p>
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
                        <StatusText text={transaction.status} />
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
