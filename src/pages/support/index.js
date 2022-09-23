import React from "react";
import { connect } from 'react-redux';
import * as actions from 'Actions';
import {Container, Row, Col} from 'react-bootstrap';
import Joi from "joi-browser";
import * as utils from "Utils";
import Form from "Common/form";
import Loader from 'Components/Loader';
import './style.scss';

class Index extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: { name: "", email: "", content: "" },
      errors: {},
      error_box: "",
      isLoading: false
    };
  }

  schema = {
    name: Joi.string()
      .required()
      .error(() => "Valid name is required."),
    email: Joi.string()
      .required()
      .email()
      .error(() => "Valid username is required."),
    content: Joi.string()
      .required()
      .error(() => "Valid message is required.")
  };

  async doSubmit() {
    const { data } = this.state;
    const { contactUs, pushAlert } = this.props;
    this.setLoaderShowOff(true);
    
    const responseData = await contactUs({
      name: data.name,
      email: data.email,
      content: data.content
    });

    this.setLoaderShowOff(false);

    if(responseData.error) {
      this.setState({ error_box: "yes" }); 
      return;
    } 

    pushAlert({
      type: 'message',
      title: utils.language("Sent!"),
      content: utils.language("Your contact request has been sent successfully!")
    });
    data.name = "";
    data.email = "";
    data.content = "";
    this.setState({ data });
  }

  setLoaderShowOff (isLoading) {
    this.setState({
      ...this.state,
      isLoading,
    });
  }

  render() {
    return (
      <Container fluid className="contact-page">
        {
          this.state.isLoading && <Loader />
        }
        <Row className="justify-content-md-center">
          <Col sm={6}>
            <form onSubmit={this.handleSubmit}>
              {/* Main title with icon image*/}
              <div className="text-center">
                <img
                  src="/images/icon/support.png"
                  className="big-icon"
                />
                <h2>{utils.language("contact")}</h2>
              </div>
              {/* NAme input field*/}
              <div className="input-group">
                {this.renderInput(
                  "name",
                  utils.language("contact_name"),
                  "/images/icon/user.png"
                )}
              </div>
              {/* Email input field*/}
              <div className="input-group">
                {this.renderInput(
                  "email",
                  utils.language("email"),
                  "/images/icon/email.png"
                )}
              </div>
              {/* Message textarea field*/}

              <div className="input-group contact-textarea">
                {this.renderTextarea(
                  "content",
                  utils.language("message"),
                  "/images/icon/message-icon.png"
                )}
              </div>
              {/* Submit button*/}
              <div>
                <button className="btn btn-block btn-red">
                  {utils.language("submit")}
                </button>
              </div>
              {this.state.error_box !== "" && (
                <div className="contact-error">
                  {utils.language("send_failure_please_email")}
                  <a href="mailto:support@xcalibyte.com">
                    support@xcalibyte.com
                  </a>
                </div>
              )}
            </form>
          </Col>
        </Row>
        {this.state.newalert}
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    pushAlert: (data) => dispatch(actions.pushAlert(data)),
    contactUs: (data) => dispatch(actions.contactUs(data)),
  };
};

export default connect(null, mapDispatchToProps)(Index);

