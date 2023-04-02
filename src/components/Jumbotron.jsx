import React from "react";
import { Container, Image } from "react-bootstrap";
import cssModule from "./Jumbotron.module.css";
import icon from "../images/icon.png";
import jumbotronImage from "../images/jumbotronImage.png";
import waves from "../images/waves.png";
import jumbo from '../images/img-jumbo.png'

const Jumbotron = () => {
  return (
    <Container className="position-relative mt-4">
      <Image src={jumbo} fluid alt="Waysbeans Jumbotron Image" />
    </Container>
  );
};

export default Jumbotron;
