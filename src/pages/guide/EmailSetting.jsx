import React from "react";
import { connect } from 'react-redux';
import * as actions from 'Actions';
import Form from "Common/form";
import * as utils from "Utils";
import Joi from "joi-browser";
import Loader from 'Components/Loader';
import './email-setting.scss';

class EmailSetting extends Form{
  constructor(props){
    super(props);
    this.state = {
      data: {
        server_type: true,
        server_address: "",
        server_port: "",
        username: "",
        from: "",
        password: "",
        email_prefix: "",
        ssl_connection: false
      },
      errors: {},
      newalert: null,
      isLoading: false
    };

    this.hideAlert = this.hideAlert.bind(this);
  }

  schema = {
    server_address: Joi.string()
      .required()
      .label("Server Address"),
    server_port: Joi.number()
      .required()
      .integer()
      .min(1)
      .max(65535)
      .label("Server Port"),
    username: Joi.string()
      .required()
      .label("Username"),
    from: Joi.string()
      .required()
      .email()
      .label("From"),
    password: Joi.string()
      .required()
      .label("Password"),
  };

  doSubmit = async () => {
    const { data } = this.state;
    const { updateEmailConfiguration } = this.props;

    var checkssl;
    if (data.ssl_connection === true) {
      checkssl = "false";
    } else {
      checkssl = "true";
    }

    this.setLoaderShowOff(true);

    const responseData = await updateEmailConfiguration({
        protocol: "smtp",
        host: data.server_address,
        port: data.server_port,
        username: data.username,
        from: data.from,
        password: data.password,
        prefix: data.email_prefix,
        starttls: checkssl
      });

      this.setLoaderShowOff(false);

      if(responseData.error) {
        this.catchError(responseData.error);
        return;
      }

      this.props.onNextStep();
  };
  setLoaderShowOff (isLoading) {
    this.setState({
      ...this.state,
      isLoading,
    });
  }

  render(){

    return (
      <React.Fragment>
        {
          this.state.isLoading && <Loader />
        }
        <div className="signin-form-head login-form-head text-center"> 
          <h4>2</h4>
          <h2>{utils.language("PLEASE SET UP EMAIL SERVER FOR NOTIFICATIONS")}</h2>
          <p>{utils.language("sending reports and assigning tasks")}</p>
        </div>
        <div className="guide-email-wrap text-center">
          <form onSubmit={this.handleSubmit}>
            <div className="input-group">
              {this.renderInput(
                "server_address",
                utils.language("server_address"),
                "/images/icon/server-address.png"
              )}
            </div>
            <div className="smtp-connection-both d-flex">
              <div className="smatp-field wrap-div disable-group smat">
                <div className="input-group checkbox-wrap smtp-check">
                  <div className="input-group-prepend">
                    <span className="input-group-text" />
                  </div>
                  {this.renderCheckbox(
                    "server_type",
                    "server_type",
                    "common-checkbox",
                    true
                  )}
                  <label className="input-field form-control admin-label" htmlFor="server_type">
                    <div className="administratorbg">
                      <div className="administrator-image" />
                    </div>
                    SMTP
                  </label>
                </div>
              </div>
              <div className="ssl-connection-field wrap-div disable-group"> 
                <div className="input-group checkbox-wrap right-check ssl-connection-check">
                  <div className="input-group-prepend">
                    <span className="input-group-text" />
                  </div>
                  {this.renderCheckbox(
                    "ssl_connection",
                    "ssl_connection",
                    "common-checkbox"
                  )}
                  <label className="input-field form-control admin-label" htmlFor="ssl_connection">
                    <div className="administratorbg">
                      <div className="administrator-image" />
                    </div>
                    {utils.language("ssl_connection")}
                  </label>
                </div>
              </div>
            </div>
            <div className="input-group">
              {this.renderInput(
                "server_port",
                utils.language("server_port"),
                "/images/icon/server-port.png"
              )}
            </div>
            <div className="input-group">
              {this.renderInput(
                "username",
                utils.language("username"),
                "/images/icon/user.png"
              )}
            </div>
            <div className="input-group">
              {this.renderInput(
                "from",
                utils.language("email_address"),
                "/images/icon/email.png"
              )}
            </div>
            <div className="input-group">
              {this.renderInput(
                "password",
                utils.language("pwd"),
                "/images/icon/password.png",
                "password"
              )}
            </div>
            <div className="input-group">
              {this.renderInput(
                "email_prefix",
                utils.language("email_prefix"),
                "/images/icon/emial-prefix.png"
              )}
              <label className="option-label">{utils.language("Optional")}</label>
            </div>
            <button 
              type="submit"
              className="btn btn-red email-server-btn text-center"
            >
              {utils.language("NEXT")}
            </button>
          </form>
        </div>
        <div className="login-massage login-email-massage">
          <p className="gray-txt">
            <a onClick={this.props.onSkip}>
              {utils.language("NO, SKIP, I'LL DO IT LATER")}
            </a>
          </p>
        </div>
        {this.state.newalert}
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateEmailConfiguration: (data) => dispatch(actions.updateEmailConfiguration(data)),
  };
};

export default connect(null, mapDispatchToProps)(EmailSetting);
