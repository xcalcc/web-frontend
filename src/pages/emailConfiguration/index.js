import React from "react";
import { connect } from 'react-redux';
import * as actions from 'Actions';
import {Container} from 'react-bootstrap';
import i18n from 'i18next';
import * as utils from "Utils";
import Joi from "joi-browser";
import Form from "Common/form";
import Loader from 'Components/Loader';

class Index extends Form {
  constructor(props) {
    super(props);
    this.timeout = 0;

    this.state = {
      data: {
        server_type: "smtp",
        server_address: "",
        server_port: "",
        username: "",
        from: "",
        password: "",
        ssl_connection: false,
        email_prefix: "",
        isLoading: false
      },
      errors: {}
    };
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
    ssl_connection: Joi.any().allow(""),
    email_prefix: Joi.any().allow("")
  };

  doSubmit = async () => {
    const { data } = this.state;
    const { updateEmailConfiguration, pushAlert } = this.props;

    var checkssl;
    if (data.ssl_connection === true) {
      checkssl = "false";
    } else {
      checkssl = "true";
    }

    this.setLoaderShowOff(true);

    const responseData = await updateEmailConfiguration({
      protocol: data.server_type,
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

    pushAlert({
      type: 'message',
      title: i18n.t('common.save'),
      content: i18n.t('common.operation-success'),
    });
  };

  async componentDidMount() {
    this.setLoaderShowOff(true);
    const { data } = this.state;
    const { fetchEmailConfiguration } = this.props;

    const responseData = await fetchEmailConfiguration();
    this.setLoaderShowOff(false);

    if(responseData.error) {
      this.catchError(responseData.error);
      return;
    }

    const emailInfo = responseData;
    const copydata = { ...data };

    if (emailInfo.starttls === "false") {
      copydata.ssl_connection = true;
    } else {
      copydata.ssl_connection = false;
    }
    copydata.server_type = emailInfo.protocol;
    copydata.server_address = emailInfo.host;
    copydata.server_port = emailInfo.port;
    copydata.username = emailInfo.username;
    copydata.from = emailInfo.from;
    copydata.password = emailInfo.password;
    copydata.email_prefix = emailInfo.prefix;

    this.setState({
      data: copydata
    });
  }

  setLoaderShowOff (isLoading) {
    this.setState({
      ...this.state,
      isLoading,
    });
  }

  render() {
    return (
        <Container fluid>
          {
            this.state.isLoading  && <Loader />
          }
          <div className="middle-content ">
            <div className="inner-container">
              <div className="signin-form-head new-user-head text-center">
                {" "}
                <img src="/images/icon/email-server-configiration.png" className="big-icon"/>
                <h2>{utils.language("email_server_config")}</h2>
                <span>{utils.language("admin_view")}</span>
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className="wrap-div disable-group">
                  <div className="input-group checkbox-wrap smtp-check">
                    <div className="input-group-prepend">
                      <span className="input-group-text"></span>
                    </div>
                    <input type="checkbox" className="common-checkbox" checked="checked" onChange={()=>{}} />
                    <label className="input-field form-control admin-label" disabled="disabled">
                      <div className="administratorbg">
                        <div className="administrator-image"></div>
                      </div>
                      SMTP
                    </label>
                  </div>
                </div>
                <div className="input-group">
                  {this.renderInput(
                    "server_address",
                    utils.language("server_address"),
                    "/images/icon/server-address.png"
                  )}
                </div>
                <div className="input-group">
                  {this.renderInput(
                    "server_port",
                    utils.language("server_port"),
                    "/images/icon/server-port.png"
                  )}
                </div>
                {/* Name input field */}
                <div className="input-group">
                  {this.renderInput(
                    "username",
                    utils.language("username"),
                    "/images/icon/user.png"
                  )}
                </div>
                {/* From input field */}
                <div className="input-group">
                  {this.renderInput(
                    "from",
                    utils.language("email_address"),
                    "/images/icon/email.png"
                  )}
                </div>
                {/* New password input field */}
                <div className="input-group">
                  {this.renderInput(
                    "password",
                    utils.language("password"),
                    "/images/icon/password.png",
                    "password"
                  )}
                </div>
                <div className="wrap-div disable-group">
                  {/* Administrator label with checkbox data start*/}
                  <div className="input-group checkbox-wrap right-check ssl-connection-check">
                    <div className="input-group-prepend">
                      {" "}
                      <span className="input-group-text" />{" "}
                    </div>
                    {this.renderCheckbox(
                      "ssl_connection",
                      "ssl_connection",
                      "common-checkbox"
                    )}
                    <label
                      className="input-field form-control admin-label"
                      htmlFor="ssl_connection"
                    >
                      <div className="administratorbg">
                        <div className="administrator-image" />
                      </div>
                      {utils.language("ssl_connection")}
                    </label>
                  </div>
                </div>
                <div className="input-group">
                  {this.renderInput(
                    "email_prefix",
                    utils.language("email_prefix"),
                    "/images/icon/emial-prefix.png"
                  )}
                  <label className="option-label">{utils.language("Optional")}</label>
                </div>
                {/* Create button */}
                <div className="form-btn input-group">
                  <button
                    type="submit"
                    className="btn btn-red btn-create w-100 text-center"
                  >
                    {utils.language("update_email_config")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    pushAlert: (data) => dispatch(actions.pushAlert(data)),
    fetchEmailConfiguration: () => dispatch(actions.fetchEmailConfiguration()),
    updateEmailConfiguration: (data) => dispatch(actions.updateEmailConfiguration(data)),
  };
};

export default connect(null, mapDispatchToProps)(Index);
