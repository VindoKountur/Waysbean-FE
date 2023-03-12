import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, Row, Container, Col } from "react-bootstrap";
import { FaAngleRight, FaPencilAlt } from "react-icons/fa";
import { useMutation, useQuery } from "react-query";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import Loading from "../../components/Loading";
import UpdateAddressModal from "../modals/address/UpdateAddressModal";
import AddAddressModal from "../../components/modals/address/AddAddressModal";
import ShippingProduct from "../cart/ShippingProduct";

import { formatRp } from "../../utils/func";
import { API } from "../../config/api";
import { UserContext } from "../../context/userContext";

const ShippingModal = ({ show, closeModal, totalPriceCart }) => {
  const navigate = useNavigate();
  const [cookies, _, removeCookie] = useCookies(["cart"]);
  const [state] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdateAddress, setShowUpdateAddress] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  let { data: addresses, refetch: refetchAddress } = useQuery(
    "addresses",
    async () => {
      const res = await API.get("/address");
      setIsLoading(false);
      return res.data.data;
    }
  );

  const initState = {
    name: "",
    phone: "",
    address: "",
    postCode: "",
  };
  const [form, setForm] = useState(initState);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showAddress, setShowAddress] = useState(false);

  const handleCloseModal = () => {
    closeModal();
    setForm(initState);
  };

  const handleSelectAddres = (idx) => {
    setSelectedAddressIndex(idx);
    setShowAddress(false);
  };

  const handlePayment = useMutation(async () => {
    try {
      const transaction = {
        name: addresses[selectedAddressIndex].name,
        phone: addresses[selectedAddressIndex].phone,
        address: addresses[selectedAddressIndex].address,
        postCode: addresses[selectedAddressIndex].post_code,
        email: state.user.email,
        products: cookies.cart,
      };
      // return console.log(transaction);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const {
        data: { data },
      } = await API.post("/transaction", transaction, config);
      removeCookie("cart", { path: "/" });
      const token = data.token;
      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/user/profile");
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/user/profile");
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/user/profile");
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert("you closed the popup without finishing the payment");
        },
      });

      //   refetch();
    } catch (error) {
      console.log("Transaction Failed", error);
    } finally {
      //   handleCloseModal();
    }
  });
  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Body className="py-4">
        <p className="h4 py-3 font-weight-bold text-center">Shipping Page</p>
        {isLoading ? (
          <Loading />
        ) : (
          <Row>
            {showAddAddress && (
              <AddAddressModal
                show={showAddAddress}
                closeModal={() => setShowAddAddress(false)}
                refetch={refetchAddress}
              />
            )}
            <Form>
              <Modal show={showAddress} onHide={() => setShowAddress(false)}>
                <Modal.Body className="py-4">
                  <div className="d-flex py-4 justify-content-between">
                    <p className="h4 font-weight-bold text-center">
                      Address List
                    </p>
                    <Button
                      type="submit"
                      className="px-2"
                      onClick={() => setShowAddAddress(true)}
                    >
                      Add New
                    </Button>
                  </div>
                  <>
                    {showUpdateAddress && (
                      <UpdateAddressModal
                        show={showUpdateAddress}
                        closeModal={() => setShowUpdateAddress(false)}
                        refetch={refetchAddress}
                        data={updateData}
                      />
                    )}
                    {addresses.length === 0 ? (
                      <div>Kosong</div>
                    ) : (
                      <Container fluid className="d-flex flex-column gap-3">
                        {addresses?.map((item, i) => (
                          <Container
                            fluid
                            key={i}
                            className="bg-white rounded text-black p-2 position-relative shadow z-0"
                          >
                            <Container
                              fluid
                              role={"button"}
                              onClick={() => handleSelectAddres(i)}
                            >
                              <Row className="mb-2">
                                <Col className="">Name</Col>
                                <Col className="fw-semibold">
                                  : {item?.name}
                                </Col>
                              </Row>
                              <Row className="mb-2">
                                <Col className="">Phone</Col>
                                <Col className="fw-semibold">
                                  : {item?.phone}
                                </Col>
                              </Row>
                              <Row className="mb-2">
                                <Col className="">Post Code</Col>
                                <Col className="fw-semibold">
                                  : {item?.post_code}
                                </Col>
                              </Row>
                              <Row className="mb-2">
                                <Col className="">Address</Col>
                                <Col className="fw-semibold">
                                  : {item?.address}
                                </Col>
                              </Row>
                            </Container>
                            <FaPencilAlt
                              onClick={() => {
                                setUpdateData(item);
                                setShowUpdateAddress(true);
                              }}
                              className="p-1 position-absolute top-0 end-0 p-0 bg-danger"
                              style={{
                                backgroundColor: "#613D2B",
                                zIndex: 5,
                              }}
                              color="white"
                              size={"1.5em"}
                              title="Edit Address"
                              role={"button"}
                            />
                          </Container>
                        ))}
                        <Form.Group className="d-flex gap-2">
                          <Button
                            variant="danger"
                            type="button"
                            onClick={() => setShowAddress(false)}
                            className="w-100 py-1"
                          >
                            Close
                          </Button>
                        </Form.Group>
                      </Container>
                    )}
                  </>
                </Modal.Body>
              </Modal>
              {/* Address */}
              <Container
                onClick={() => setShowAddress(true)}
                fluid
                className="bg-white rounded text-black p-2 position-relative shadow mb-3"
                role={"button"}
                title="Change Address"
              >
                <FaAngleRight
                  className="position-absolute end-0 top-50 me-2"
                  size={"1.5em"}
                />
                <Row className="mb-2">
                  <Col sm={3} className="">
                    Name
                  </Col>
                  <Col sm={9} className="fw-semibold">
                    : {addresses[selectedAddressIndex]?.name}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col sm={3} className="">
                    Phone
                  </Col>
                  <Col sm={9} className="fw-semibold">
                    : {addresses[selectedAddressIndex]?.phone}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col sm={3} className="">
                    Post Code
                  </Col>
                  <Col sm={9} className="fw-semibold">
                    : {addresses[selectedAddressIndex]?.post_code}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col sm={3} className="">
                    Address
                  </Col>
                  <Col sm={9} className="fw-semibold">
                    : {addresses[selectedAddressIndex]?.address}
                  </Col>
                </Row>
              </Container>
              <hr />
              <Container>
                {cookies.cart.map((v, i) => (
                  <ShippingProduct
                    key={i}
                    item={v}
                    idx={i}
                    totalPrice={totalPrice}
                    setTotalPrice={setTotalPrice}
                  />
                ))}
              </Container>
              <Container className="d-flex justify-content-between">
                <p className="fw-semibold">Total Price</p>
                <p className="fw-bold">{formatRp(totalPriceCart)}</p>
              </Container>
              {/* Address */}
              {!showAddress && (
                <>
                  <Form.Group>
                    <Button
                      onClick={() => handlePayment.mutate()}
                      type="button"
                      className="w-100 py-2"
                    >
                      Checkout
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
                </>
              )}
              {/* <div className="mt-2">
              <p className="text-center">
                Don't have an account? Klik{" "}
                <button
                  onClick={handleToRegister}
                  type="button"
                  className="border-0 bg-transparent"
                  style={{ fontWeight: "bold" }}
                >
                  Here
                </button>
              </p>
            </div> */}
            </Form>
          </Row>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ShippingModal;
