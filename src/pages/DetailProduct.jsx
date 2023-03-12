import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { API } from "../config/api";
import { formatRp } from "../utils/func";
import { IMG_PATH } from "../utils/const";
import { UserContext } from "../context/userContext";

const DetailProduct = () => {
  const [state] = useContext(UserContext);
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [cookies, setCookies] = useCookies(["cart"]);
  const [productInCart, setProductInCart] = useState(0);

  let { data: product } = useQuery("productChace", async () => {
    const res = await API.get(`/product/${id}`);
    return res.data.data;
  });

  const checkProductInCart = () => {
    let cart = cookies.cart || [];
    let findQuantity = cart.find((item) => item.id == id)?.orderQuantity || 0;
    setProductInCart(findQuantity);
  };

  useEffect(() => {
    checkProductInCart();
  }, [cookies.cart]);

  const handleAddToCart = () => {
    let myCart = cookies.cart || [];
    let cartValue = {
      id: product.id,
      orderQuantity: 1,
      price: product.price
    };
    if (myCart.length === 0) {
      setCookies("cart", [cartValue], { path: "/" });
    } else {
      let findIndex = myCart.findIndex((item) => item.id == product.id);
      if (findIndex < 0) {
        myCart = [...myCart, cartValue];
      } else {
        myCart[findIndex].orderQuantity += 1;
      }
      setCookies("cart", myCart, { path: "/" });
    }
  };

  const handleMinusItem = async () => {
    let myCart = cookies.cart;
    let findIndex = myCart.findIndex((val) => val.id == product.id);
    myCart[findIndex].orderQuantity -= 1;
    if (myCart[findIndex].orderQuantity === 0) {
      const val = await deleteCartItem();
      if (!val) {
        myCart[findIndex].orderQuantity += 1;
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
      let findIndex = myCart.findIndex((val) => val.id == product.id);
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
            <img
              src={IMG_PATH + product?.photo}
              alt={product?.name}
              height={500}
            />
          </Col>
          <Col sm={6} className="p-4">
            <h1 style={{ color: "#613D2B", fontWeight: "bold" }}>
              {product?.title}
            </h1>
            <p style={{ color: "#974A4A" }}>Stock : {product?.stock}</p>
            <p style={{ textAlign: "justify" }}>{product?.description}</p>
            <p
              style={{
                textAlign: "end",
                color: "#974A4A",
                fontSize: "1.5em",
                fontWeight: "600",
              }}
            >
              {formatRp(product?.price)}
            </p>
            {state.isLogin && (
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
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DetailProduct;
