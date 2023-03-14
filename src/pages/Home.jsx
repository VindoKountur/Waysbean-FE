import React from "react";
import Jumbotron from "../components/Jumbotron";
import Products from "../components/Products";

const Home = () => {
  document.title = "Waysbeans | Home"
  return (
    <>
      <Jumbotron />
      <Products />
    </>
  );
};

export default Home;
