import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import trashIcon from "../images/trash.png";
import { formatRp } from "../utils/func";
import { FaPlus, FaMinus } from "react-icons/fa";

const Cart = () => {
  const [cookies, setCookies, removeCookie] = useCookies(["cart", "users"]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    cekQuantity();
    cekTotalPrice();
  }, [cookies.cart]);

  const cekQuantity = () => {
    let cartData = cookies.cart;
    let tmpTotal = 0;
    if (cartData) {
      cartData.map((val) => {
        tmpTotal += val.quantity;
      });
    }
    setTotalQuantity(tmpTotal);
  };

  const cekTotalPrice = () => {
    let cartData = cookies.cart;
    let tmpTotal = 0;
    if (cartData) {
      cartData.map((val) => {
        tmpTotal += val.price * val.quantity;
      });
    }
    setTotalPrice(tmpTotal);
  };

  const handleAddItem = (item) => {
    let myCart = cookies.cart || [];
    let cartValue = {
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    };
    if (myCart.length === 0) {
      setCookies("cart", [cartValue], { path: "/" });
    } else {
      let findIndex = myCart.findIndex((val) => val.id == item.id);
      if (findIndex < 0) {
        // if data.id is not exist
        myCart = [...myCart, cartValue];
      } else {
        // if data.id exist
        myCart[findIndex].quantity += 1;
      }
      setCookies("cart", myCart, { path: "/" });
    }
  };

  const handleMinusItem = (item) => {
    let myCart = cookies.cart || [];
    let cartValue = {
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
    };
    if (myCart.length === 0) {
      setCookies("cart", [cartValue], { path: "/" });
    } else {
      let findIndex = myCart.findIndex((val) => val.id == item.id);
      if (findIndex < 0) {
        // if data.id is not exist
        myCart = [...myCart, cartValue];
      } else {
        // if data.id exist
        myCart[findIndex].quantity -= 1;
        if (myCart[findIndex].quantity === 0) {
          deleteCartItem(item);
        }
      }
      setCookies("cart", myCart, { path: "/" });
    }
  };

  const deleteCartItem = async (item) => {
    const { value } = await Swal.fire({
      text: "Delete product from cart?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      confirmButtonColor: "red",
    });
    if (value) {
      let myCart = cookies.cart || [];
      let findIndex = myCart.findIndex((val) => val.id == item.id);
      myCart.splice(findIndex, 1);
      setCookies("cart", myCart, { path: "/" });
    }
    return value;
  };

  const handlePay = async () => {
    const { value } = await Swal.fire({
      text: "Confirm booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    });

    if (value) {
      const user = cookies.users;
      const items = cookies.cart;

      let newTransaction = {
        id: new Date().getTime(),
        userMail: user.email,
        fullname: user.fullname,
        address: user.address,
        postCode: user.postCode,
        items: items,
        date: new Date().toISOString(),
        stat: "waiting",
      };

      let transactionList =
        JSON.parse(localStorage.getItem("transactions")) || [];
      console.log(newTransaction);
      // if (transactionList.length === 0) {
      transactionList = [...transactionList, newTransaction];
      localStorage.setItem("transactions", JSON.stringify(transactionList));
      // } else {
      await Swal.fire({
        text: "Thank you for ordering in us, please wait 1 x 24 hours to verify you order",
        icon: "success",
        timer: 2000,
      });
      removeCookie("cart", { path: "/" });
      navigate("/");
      // }
    }
  };

  return (
    <Container style={{ color: "#613D2B" }}>
      <p className="mt-5 fw-bold">My Cart</p>
      <br />
      <p>Review Your Order</p>
      <Container fluid>
        <Row sm={12}>
          <Col sm={8}>
            {!cookies.cart ? (
              <div>There's nothing in cart</div>
            ) : (
              cookies.cart.map((v, i) => {
                let borderBottom =
                  i == cookies.cart.length - 1 ? "border-bottom" : "";
                return (
                  <Row
                    key={i}
                    sm={12}
                    className={`border-top border-3 py-2 ${borderBottom}`}
                  >
                    <Col>
                      <img
                        className="object-fit-cover"
                        src={v.image}
                        height={75}
                        width={75}
                        alt={v.title}
                      />
                    </Col>
                    <Col sm={8}>
                      <p className="fw-bold">{v.title}</p>
                      <div className="d-flex gap-2 fw-bold align-items-center">
                        <FaMinus
                          onClick={() => handleMinusItem(v)}
                          size={"0.8em"}
                          style={{ cursor: "pointer" }}
                        />
                        <span
                          className="px-2"
                          style={{ backgroundColor: "#F6E6DA" }}
                        >
                          {v.quantity}
                        </span>
                        <FaPlus
                          onClick={() => handleAddItem(v)}
                          size={"0.8em"}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </Col>
                    <Col>
                      <p>{formatRp(v.price)}</p>
                      <img
                        src={trashIcon}
                        style={{ cursor: "pointer" }}
                        alt="delete"
                        onClick={() => deleteCartItem(v)}
                      />
                    </Col>
                  </Row>
                );
              })
            )}
          </Col>
          <Col sm={4}>
            <div className="d-flex justify-content-between border-3 py-2 border-top">
              <p>Subtotal</p>
              <p>{formatRp(totalPrice)}</p>
            </div>
            <div className="d-flex justify-content-between border-3 py-2 border-bottom">
              <p>Quantity</p>
              <p>{totalQuantity}</p>
            </div>
            <div className="d-flex justify-content-between border-3 py-2 fw-bold">
              <p>Total</p>
              <p>{formatRp(totalPrice)}</p>
            </div>
            <br />
            {totalQuantity > 0 && (
              <button
                onClick={handlePay}
                className="w-100 border-0 fw-bold text-white py-1 rounded"
                style={{
                  backgroundColor: "#613D2B",
                  cursor: "pointer",
                }}
              >
                Pay
              </button>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Cart;
