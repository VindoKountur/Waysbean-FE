import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaPlus, FaMinus, FaTrash, FaTrashAlt } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { formatRp } from "../utils/func";

const DetailProduct = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [cookies, setCookies] = useCookies(["cart"]);
  const [productInCart, setProductInCart] = useState(0);

  const getProduct = () => {
    // fetch("/products.json")
    //   .then((res) => res.json())
    //   .then((products) => {
    //     let product = products.find((product) => product.id == id);
    //     setData(product)
    //   });
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const findProduct = products.find((product) => product.id === parseInt(id));
    setData(findProduct);
  };

  const checkProductInCart = () => {
    let cart = cookies.cart || [];
    let findQuantity = cart.find((item) => item.id == id)?.quantity || 0;
    setProductInCart(findQuantity);
  };

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    checkProductInCart();
  }, [cookies.cart]);

  const handleAddToCart = () => {
    let myCart = cookies.cart || [];
    let cartValue = {
      id: data.id,
      title: data.title,
      price: data.price,
      image: data.image,
      quantity: 1,
    };
    if (myCart.length === 0) {
      setCookies("cart", [cartValue], { path: "/" });
    } else {
      let findIndex = myCart.findIndex((item) => item.id == data.id);
      if (findIndex < 0) {
        myCart = [...myCart, cartValue];
      } else {
        myCart[findIndex].quantity += 1;
      }
      setCookies("cart", myCart, { path: "/" });
    }
  };

  const handleMinusItem = async () => {
    let myCart = cookies.cart;
    let findIndex = myCart.findIndex((val) => val.id == data.id);
    myCart[findIndex].quantity -= 1;
    if (myCart[findIndex].quantity === 0) {
      const val = await deleteCartItem();
      if (!val) {
        myCart[findIndex].quantity += 1;
      }
    }
    setCookies("cart", myCart, { path: "/" });
  };

  const deleteCartItem = async () => {
    const { value } = await Swal.fire({
      text: "Delete product from cart?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      confirmButtonColor: "red",
    });
    if (value) {
      let myCart = cookies.cart || [];
      let findIndex = myCart.findIndex((val) => val.id == data.id);
      myCart.splice(findIndex, 1);
      setCookies("cart", myCart, { path: "/" });
    }
    return value;
  };

  return (
    <>
      <Container className="mt-5">
        <Row sm={12} className="d-flex justify-content-center">
          <Col sm={5}>
            <img src={data.image} alt={data.title} height={500} />
          </Col>
          <Col sm={6} className="p-4">
            <h1 style={{ color: "#613D2B", fontWeight: "bold" }}>
              {data.title}
            </h1>
            <p style={{ color: "#974A4A" }}>Stock : {data.stock}</p>
            <p style={{ textAlign: "justify" }}>{data.description}</p>
            <p
              style={{
                textAlign: "end",
                color: "#974A4A",
                fontSize: "1.5em",
                fontWeight: "600",
              }}
            >
              {formatRp(data.price)}
            </p>
            <div className="d-flex gap-3 align-items-center mt-2">
              {productInCart > 0 && (
                <>
                  <FaTrashAlt
                    className="text-white p-1 rounded"
                    style={{ backgroundColor: "#613D2B", cursor: "pointer" }}
                    size={40}
                    onClick={() => deleteCartItem()}
                  />
                  <FaMinus
                    style={{ backgroundColor: "#613D2B", cursor: "pointer" }}
                    className="text-white p-1 rounded"
                    size={40}
                    onClick={() => handleMinusItem()}
                  />
                </>
              )}
              <button
                className="w-100 rounded text-white border-0 py-2"
                style={{ backgroundColor: "#613D2B" }}
                onClick={() => handleAddToCart()}
              >
                {productInCart === 0
                  ? "Add Cart"
                  : `Product in cart : ${productInCart}`}
              </button>
              {productInCart > 0 && (
                <FaPlus
                  style={{ backgroundColor: "#613D2B", cursor: "pointer" }}
                  className="text-white p-1 rounded"
                  size={40}
                  onClick={() => handleAddToCart()}
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DetailProduct;
