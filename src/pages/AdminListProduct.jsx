import React, { useEffect, useState } from "react";
import { Container, Table, InputGroup, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";

import { API } from "../config/api";
import { IMG_PATH } from "../utils/const";

const AdminListProduct = () => {
  const [searchName, setSearchName] = useState("");
  const fetchProducts = async ({queryKey}) => {
    const [_key, name ] = queryKey
    let str = "/products";
    if (name) {
      str += `?name=${name}`;
    }
    const res = await API.get(str);
    return res.data.data;
  };
  let { data: products, refetch } = useQuery(
    ["productsChace", searchName],
    fetchProducts
  );

  const execDeleteProduct = useMutation(async (id) => {
    await API.delete(`/product/${id}`);
    refetch();
  });

  const deleteProductHandler = async (id, productTitle) => {
    try {
      const { value } = await Swal.fire({
        icon: "warning",
        title: "Delete Product?",
        text: `Name : ${productTitle}`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Confirm",
        confirmButtonColor: "red",
      });
      if (value) {
        execDeleteProduct.mutate(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between">
        <p style={{ color: "#613D2B", fontWeight: "700" }}>List Product</p>
        <InputGroup className="mb-3 w-25">
          <Form.Control
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search product name"
            aria-label="name"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
      </div>
      <Table bordered hover className="mt-2">
        <thead className="bg-light">
          <tr>
            <th>No</th>
            <th className="text-center">Image</th>
            <th className="text-center">Name</th>
            <th className="text-center">Stock</th>
            <th className="text-center">Price</th>
            <th className="text-center">Description</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <Container className="d-flex align-items-center justify-content-center">
                  <img
                    src={IMG_PATH + product.photo}
                    className="img-fluid"
                    height={100}
                    width={100}
                    style={{ objectFit: "cover" }}
                    alt={product.name}
                  />
                </Container>
              </td>
              <td>{product.name}</td>
              <td>{product.stock}</td>
              <td>{product.price}</td>
              <td>{product.description}</td>
              <td>
                <div className="d-flex gap-2 justify-content-around">
                  <Link to={`/admin/update/${product.id}`}>
                    <button className="bg-primary text-white border-0 py-1 px-3">
                      Update
                    </button>
                  </Link>
                  <button
                    className="bg-danger text-white border-0 py-1 px-3"
                    onClick={() =>
                      deleteProductHandler(product.id, product.name)
                    }
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminListProduct;
