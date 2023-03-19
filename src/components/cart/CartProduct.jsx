import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { FaPlus, FaMinus } from "react-icons/fa";
import { formatRp } from "../../utils/func";
import { useCookies } from "react-cookie";
import trashIcon from "../../images/trash.png";
import Swal from "sweetalert2";
import { IMG_PATH } from "../../utils/const";
import { useQuery } from "react-query";
import { API } from "../../config/api";

const CartProduct = ({ item, idx }) => {
  const [cookies, setCookies, removeCookie] = useCookies(["cart", "users"]);
  const [product, setProduct] = useState({});

  const getProduct = async () => {
    const {
      data: { data },
    } = await API.get("/product/" + item.id);

    let cart = cookies.cart;
    let idx = cart.findIndex((v) => v.id === data.id);
    cart[idx].price = data.price;
    setCookies("cart", cart, { path: "/" });
    setProduct(data);
  };

  useEffect(() => {
    getProduct();
  }, []);

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
        myCart[findIndex].orderQuantity += 1;
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
        myCart[findIndex].orderQuantity -= 1;
        if (myCart[findIndex].orderQuantity === 0) {
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

  let borderBottom = idx == cookies.cart.length - 1 ? "border-bottom" : "";
  return (
    <Row sm={12} className={`border-top border-3 py-2 ${borderBottom}`}>
      <Col>
        <img
          className="object-fit-cover"
          src={IMG_PATH + product.photo}
          height={75}
          width={75}
          alt={product.name}
        />
      </Col>
      <Col sm={8}>
        <p className="fw-bold">{product?.name}</p>
        <div className="d-flex gap-2 fw-bold align-items-center">
          <FaMinus
            onClick={() => handleMinusItem(item)}
            size={"0.8em"}
            style={{ cursor: "pointer" }}
          />
          <span className="px-2" style={{ backgroundColor: "#F6E6DA" }}>
            {item.orderQuantity}
          </span>
          <FaPlus
            onClick={() => handleAddItem(item)}
            size={"0.8em"}
            style={{ cursor: "pointer" }}
          />
        </div>
      </Col>
      <Col>
        <p>{formatRp(product?.price)}</p>
        <img
          src={trashIcon}
          style={{ cursor: "pointer" }}
          alt="delete"
          onClick={() => deleteCartItem(item)}
        />
      </Col>
    </Row>
  );
};

export default CartProduct;
