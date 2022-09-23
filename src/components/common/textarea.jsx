import React from "react";
import * as utils from "Utils";

const Textarea = ({ name, label, icon, error, ...rest }) => {
  return (
    <React.Fragment>
      <div className="input-group-prepend">
        <span className="input-group-text">
          <img src={icon} title={label} alt={label} />
        </span>
      </div>
      <div className="content">
        <div className="textarea-wrapper">
          <textarea {...rest} name={name} id={name} placeholder={label} />
          <div className="textarea-clone" />
        </div>
      </div>
      {error && <div className="error">{utils.language(error) || error}</div>}
    </React.Fragment>
  );
};

export default Textarea;
