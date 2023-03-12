import React, { useState, useEffect } from "react";
import { Container, Table, Dropdown } from "react-bootstrap";
import { useQuery } from 'react-query'

import DetailModal from '../components/DetailModal'

import { API } from '../config/api'
import { dateFormat } from '../utils/func'

const AdminDashboard = () => {
  const [transactionList, setTransactionList] = useState([]);
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

  useEffect(() => {
    // getTransactionList();
  }, []);

  const getTransactionList = () => {
    let list = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactionList(list);
  };

  const changeTransactionStatus = (transactionId, statusTxt) => {
    let list = JSON.parse(localStorage.getItem("transactions")) || [];
    let indexNumber = list.findIndex((item) => item.id === transactionId);
    list[indexNumber].stat = statusTxt;
    localStorage.setItem("transactions", JSON.stringify(list));
    getTransactionList();
  };
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
                    <Dropdown>
                      <Dropdown.Toggle
                        className="text-white"
                        variant={variants[transaction.status]}
                      >
                        {statText[transaction.status]}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() =>
                            changeTransactionStatus(transaction.id, "waiting")
                          }
                        >
                          Waiting Approve
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            changeTransactionStatus(transaction.id, "success")
                          }
                        >
                          Success
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            changeTransactionStatus(transaction.id, "cancel")
                          }
                        >
                          Cancel
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            changeTransactionStatus(transaction.id, "ontheway")
                          }
                        >
                          On The Way
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
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

export default AdminDashboard;
