import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AdminListProduct = () => {
  const [products, setProducts] = useState([]);

  const getProducts = () => {
    // fetch("/products.json")
    //   .then((res) => res.json())
    //   .then((data) => setProducts(data));
    let data = JSON.parse(localStorage.getItem("products")) || [];
    // data.map((product) => {
    //   // let imageValue;
    //   // console.log(product.image);
    //   // fetch(product.image).then(res => res.blob).then(v => {
    //   //   console.log(v);
    //   // })
    //   return {...product, image: imageValue}
    // })
    setProducts(data);
  };

  const deleteProductHandler = async (id, productTitle) => {
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
      let data = JSON.parse(localStorage.getItem("products")) || [];
      let filteredProducts = data.filter((product) => product.id != id);

      localStorage.setItem("products", JSON.stringify(filteredProducts));
      getProducts();
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container className="mt-5">
      <p style={{ color: "#613D2B", fontWeight: "700" }}>List Product</p>
      <Table bordered hover>
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
          {products.map((product, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <img
                  src={product.image}
                  height={50}
                  width={50}
                  style={{ objectFit: "cover" }}
                  alt="produk"
                />
              </td>
              <td>{product.title}</td>
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
                      deleteProductHandler(product.id, product.title)
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
