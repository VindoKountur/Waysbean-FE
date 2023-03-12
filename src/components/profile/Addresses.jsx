import React, { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { FaCaretDown, FaCaretRight, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useQuery } from "react-query";

import Loading from "../Loading";
import AddAddressModal from "../../components/modals/address/AddAddressModal";
import UpdateAddressModal from "../../components/modals/address/UpdateAddressModal";

import { API } from "../../config/api";

const Addresses = () => {
  const [isGettingAddress, setIsGettingAddress] = useState(true);
  const [showAddresses, setShowAddresses] = useState(true);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showUpdateAddress, setShowUpdateAddress] = useState(false);
  const [updateData, setUpdateData] = useState({});

  let { data: addresses, refetch: refetchAddress } = useQuery(
    "address",
    async () => {
      const res = await API.get("/address");
      setIsGettingAddress(false);
      return res.data.data;
    }
  );
  return (
    <Row>
      {isGettingAddress ? (
        <Loading />
      ) : (
        <>
          {showAddAddress && (
            <AddAddressModal
              show={showAddAddress}
              closeModal={() => setShowAddAddress(false)}
              refetch={refetchAddress}
            />
          )}
          <Row>
            <Col>
              <p className="ms-1 fs-5 fw-bold d-flex align-items-center">
                {showAddresses ? (
                  <FaCaretDown
                    role={"button"}
                    onClick={() => setShowAddresses(!showAddresses)}
                  />
                ) : (
                  <FaCaretRight
                    role={"button"}
                    onClick={() => setShowAddresses(!showAddresses)}
                  />
                )}
                <label htmlFor="">Address</label>
                <FaPlus
                  onClick={() => setShowAddAddress(true)}
                  role={"button"}
                  title={"Add Address"}
                  className="ms-3 text-secondary"
                  size={"0.8em"}
                />
              </p>
              {showAddresses && (
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
                          className="bg-white rounded text-black p-2 position-relative shadow"
                        >
                          <FaPencilAlt
                            onClick={() => {
                              setUpdateData(item);
                              setShowUpdateAddress(true);
                            }}
                            style={{ backgroundColor: "#613D2B" }}
                            color="white"
                            className="position-absolute top-0 end-0 p-1"
                            size={"1.3em"}
                            role={"button"}
                          />
                          <Row className="mb-2">
                            <Col className="">Name</Col>
                            <Col className="fw-semibold">: {item?.name}</Col>
                          </Row>
                          <Row className="mb-2">
                            <Col className="">Phone</Col>
                            <Col className="fw-semibold">: {item?.phone}</Col>
                          </Row>
                          <Row className="mb-2">
                            <Col className="">Post Code</Col>
                            <Col className="fw-semibold">
                              : {item?.post_code}
                            </Col>
                          </Row>
                          <Row className="mb-2">
                            <Col className="">Address</Col>
                            <Col className="fw-semibold">: {item?.address}</Col>
                          </Row>
                        </Container>
                      ))}
                    </Container>
                  )}
                </>
              )}
            </Col>
          </Row>
        </>
      )}
    </Row>
  );
};

export default Addresses;
