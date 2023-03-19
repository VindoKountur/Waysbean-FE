import React, { useState } from "react";
import { Container, Table } from "react-bootstrap";
import { useQuery } from 'react-query'

import DetailModal from '../components/DetailModal'

import { API } from '../config/api'
import { dateFormat } from '../utils/func'

const AdminDashboard = () => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [itemDetail, setItemDetail] = useState(null)


  let { data: transactions } = useQuery('transactions', async () => {
    const res = await API.get("/transactions")
    return res.data.data
  })

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setItemDetail(null);
  }

  const handleShowDetail = (item) => {
    setShowDetailModal(true)
    setItemDetail(item)
  }

  return (
    <Container fluid className="mt-5">
      <h1 className="fw-bold fs-3" style={{ color: "#613D2B" }}>
        Income Transaction
      </h1>
      <Table hover>
        <thead>
          <tr>
            <th>NO</th>
            <th>Name</th>
            <th>Address</th>
            <th>Post Code</th>
            <th>Date</th>
            <th>Product Order</th>
            <th>View Detail</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.length === 0 ? (
            <tr>
              <td colSpan={6} align="center" className="py-4">
                No Transactions
              </td>
            </tr>
          ) : (
            transactions?.map((transaction, i) => {
              let listItemName = transaction.products
                .map((v) => v.name)
                .join(", ");

              let variants = {
                waiting: "warning",
                success: "success",
                cancel: "danger",
                ontheway: "info",
              };
              let statText = {
                waiting: "Waiting Approve",
                success: "Success",
                cancel: "Cancel",
                ontheway: "On The Way",
              };
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{transaction.name}</td>
                  <td>{transaction.address}</td>
                  <td>{transaction.post_code}</td>
                  <td>{dateFormat(transaction.created_at)}</td>
                  <td>{listItemName}</td>
                  <td>
                    <button className="btn btn-light" onClick={() => handleShowDetail(transaction)}>Detail</button>
                  </td>
                  <td>
                    <StatusText text={transaction.status}></StatusText>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
      <DetailModal show={showDetailModal} handleClose={handleCloseDetail} detailItem={itemDetail} />
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

export default AdminDashboard;
