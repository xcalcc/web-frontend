import React from "react";

const Checkbox = ({ name, label, disabled, ...rest }) => {
  return (
    <React.Fragment>
      <input
        {...rest}
        type="checkbox"
        name={name}
        id={name}
        disabled={disabled}
      />
    </React.Fragment>
  );
};

export default Checkbox;
