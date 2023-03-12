import React from "react";
import { Col } from "react-bootstrap";

const Loading = () => {
  return (
    <Col sm={12}>
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only"></span>
      </div>
    </Col>
  );
};

export default Loading;
