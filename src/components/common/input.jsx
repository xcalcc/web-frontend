import React from "react";
import * as utils from "Utils";

const Input = ({ name, label, icon, className, error, imgClass, ...rest }) => {
  if(icon && icon.indexOf("/") !== 0){
    icon = "/" + icon;
  }
  return (
    <React.Fragment>
      {icon && (
        <div className="input-group-prepend">
          <span className="input-group-text">
            <img
              src={icon}
              title={label}
              alt={label}
              className={imgClass}
            />
          </span>
        </div>
      )}
      <input
        {...rest}
        name={name}
        id={name}
        placeholder={label}
        className={"input-field form-control " + className}
      />
      {error && <div className="error">{utils.language(error) || error}</div>}
    </React.Fragment>
  );
};

export default Input;
