import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import * as utils from "Utils";

const ErrorAlert = ({ title, onConfirm, msg }) => {
  return (
    <SweetAlert
      custom
      confirmBtnBsStyle={"danger"}
      confirmBtnText={utils.language("Ok")}
      title={title}
      onConfirm={onConfirm()}
      customIcon={utils.getThemeImg("warning.svg")}
    >
      <div dangerouslySetInnerHTML={{__html: msg}}></div>
    </SweetAlert>
  );
};

export default ErrorAlert;
