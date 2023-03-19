import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useCookies } from "react-cookie";

import CartProduct from "../components/cart/CartProduct";
import ShippingModal from "../components/modals/ShippingModal";

import { formatRp } from "../utils/func";

const Cart = () => {
  const [cookies] = useCookies(["cart", "users"]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showShipping, setShowShipping] = useState(false);

  useEffect(() => {
    cekQuantity();
    cekTotalPrice();
  }, [cookies.cart]);

  useEffect(() => {
    cekQuantity();
    cekTotalPrice();
  }, []);

  const cekQuantity = () => {
    let cartData = cookies.cart;
    let tmpTotal = 0;
    cartData?.map((val) => {
      tmpTotal += val.orderQuantity;
    });
    setTotalQuantity(tmpTotal);
  };

  const cekTotalPrice = () => {
    let cartData = cookies.cart || [];
    let tmpTotal = 0;
    if (cartData) {
      cartData?.map((val) => {
        tmpTotal += val.price * val.orderQuantity;
      });
    }
    setTotalPrice(tmpTotal);
  };

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

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
              cookies.cart.map((v, i) => (
                <CartProduct
                  key={i}
                  item={v}
                  idx={i}
                  totalPrice={totalPrice}
                  setTotalPrice={setTotalPrice}
                />
              ))
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
              <>
                {showShipping && (
                  <ShippingModal
                    show={showShipping}
                    closeModal={() => setShowShipping(false)}
                    totalPriceCart={totalPrice}
                  />
                )}
                <button
                  onClick={() => setShowShipping(true)}
                  // onClick={handlePay}
                  className="w-100 border-0 fw-bold text-white py-1 rounded"
                  style={{
                    backgroundColor: "#613D2B",
                    cursor: "pointer",
                  }}
                >
                  Pay
                </button>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Cart;
