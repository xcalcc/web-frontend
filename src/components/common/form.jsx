import React, {Component} from "react";
import Joi from "joi-browser";
import Input from "./input";
import Checkbox from "./checkbox";
import Textarea from "./textarea";
import * as utils from "Utils";
import ErrorAlert from "./errorAlert";

class Form extends Component {
  state = {
    data: {},
    errors: {}
  }

  componentDidCatch(error, info){
    console.log("error log")
  }

  validation = () => {
    const options = {
      abortEarly: false,
      allowUnknown: true
    };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};

    for (let items of error.details) {
      if (items.message.indexOf("must be a string") > -1) {
        var fieldName = items.path[0].replace(/"/g, "");
        errors[items.path[0]] =
          fieldName.charAt(0).toUpperCase() +
          fieldName.slice(1) +
          " is not allowed to be empty.";
      } else {
        fieldName = items.message.replace(/"/g, "");
        errors[items.path[0]] =
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      }
    }
    return errors;
  };

  validateProperty = ({ name, value }) => {
    // const obj = { [name]: value };
    // const schema = { [name]: this.schema[name] };
    // const { error } = Joi.validate(obj, schema);
    // return error ? error.details[0].message : null;
  };

  handleSubmit = (e, checkData) => {
    e.preventDefault();
    let checkResult = {};
    let validateResult = this.validation();
    if(utils.isFunction(checkData)){
      checkResult = checkData();
    }
    let errors = {...checkResult, ...validateResult};
    this.setState({ errors });
    if (!utils.isEmptyObject(errors)) return;
    this.doSubmit();
  };

  handleChange = (e) => {
    const errors = { ...this.state.errors };
    const data = { ...this.state.data };

    let input = e.target;

    if (input.name === "confirmpassword") {
      if (this.state.data["newpassword"] !== input.value) {
        const errorMessage = this.validateProperty(input);
        errors[input.name] = errorMessage;
      } else {
        delete errors[input.name];
      }
    } else {
      const errorMessage = this.validateProperty(input);
      if (errorMessage) errors[input.name] = errorMessage;
      else delete errors[input.name];
    }

    let value = input.value || "";
    value = value.replace(/^\s+/, "");

    data[input.name] = value;

    this.setState({ data, errors });
  };

  handleCheck(event) {
    const data = { ...this.state.data };
    this.setState({
      [event.name]: event.checked
    });
    data[event.name] = event.checked;
    this.setState({ data });
  }

  renderInput(name, label, icon = "", type = "text", cls = "", disabled = false, imgClass = "") {
    const { data, errors } = this.state;
    return (
      <Input
        icon={icon}
        type={type}
        name={name}
        label={label}
        value={data[name] || ""}
        onChange={this.handleChange}
        error={errors[name]}
        className={cls}
        disabled={disabled}
        imgClass={imgClass}
      />
    );
  }

  renderTextarea(name, label, icon) {
    const { data, errors } = this.state;
    return (
      <Textarea
        icon={icon}
        name={name}
        label={label}
        value={data[name] || ""}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderCheckbox(name, label, className, disabled) {
    const { data } = this.state;
    return (
      <Checkbox
        type="checkbox"
        name={name}
        label={label}
        checked={data[name]}
        className={className}
        disabled={disabled}
        onChange={event => {
          this.handleCheck(event.target);
        }}
      />
    );
  }

  hideAlert() {
    this.setState({
      newalert: null
    });
  }

  catchError(err, callback) {
    let is401 = false;
    let is403 = false;

    if(err.response && err.response.data){
      is401 = err.response.data.status === 401;
      is403 = err.response.data.status === 403;
    }

    //redirect directly to the error page
    if(is403) return;

    let message = utils.getApiMessage(err);

    this.setState({
      newalert: <ErrorAlert 
                  title={utils.language("Error")} 
                  onConfirm={() => () => {
                    this.hideAlert();
                    if(is401){
                      this.props.history.replace("/login");
                    } else {
                      callback && callback();
                    }
                  }} 
                  msg={message} 
                />
    });
  };
}

export default Form;
