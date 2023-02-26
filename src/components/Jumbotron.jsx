import React from "react";
import { Container } from "react-bootstrap";
import cssModule from "./Jumbotron.module.css";
import icon from "../images/icon.png";
import jumbotronImage from "../images/jumbotronImage.png";
import waves from "../images/waves.png";

const Jumbotron = () => {
  return (
    <Container className="position-relative mt-4">
      <div className={`jumbotron ${cssModule.jumboContainer} p-5`}>
        <img src={icon} alt="Icon" height={180} />
        <p className="text-w">BEST QUALITY COFFEE BEANS</p>
        <p>
          Quality freshly roasted coffee made just for you. <br />
          Pour, brew and enjoy
        </p>
        <div></div>
        <img
          src={jumbotronImage}
          height={250}
          alt="img"
          className={`position-absolute ${cssModule.jumboImg}`}
        />
        <img
          src={waves}
          height={150}
          alt="img"
          className={`position-absolute ${cssModule.waves}`}
        />
      </div>
    </Container>
  );
};

export default Jumbotron;
