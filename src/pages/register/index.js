import React from "react";
import { connect } from 'react-redux';
import * as actions from 'Actions';
import {Container} from 'react-bootstrap';
import Joi from "joi-browser";
import i18n from 'i18next';
import Form from "Common/form";
import userService from "ToDeprecateServiceFolder/userService";
import Loader from 'Components/Loader';

class Index extends Form {
  // Initial constructor of the class
  constructor(props) {
    super(props);

    this.state = {
      data: { displayName: "", userName: "", newpassword: "", email: "", isAdmin: false },
      errors: {},
      isLoading: false
    };
    this.baseState = this.state;
  }
  // Defined the schema for validations
  schema = {
    displayName: Joi.string()
      .required()
      .max(15)
      .label("Name"),
    userName: Joi.string()
      .required()
      .min(3)
      .max(15)
      .label("Login"),
    newpassword: Joi.string()
      .required()
      .min(6)
      .label("Password"),
    email: Joi.string()
      .required()
      .email()
      .label("Email"),
    isAdmin: Joi.any().allow(""),
    confirmpassword: Joi.string()
      .valid(Joi.ref("newpassword"))
      .required()
      .options({
        language: { any: { allowOnly: "!!Passwords do not match" } }
      })
  };

  doSubmit = () => {
    // Call the server
    const { data } = this.state;
    const { pushAlert } = this.props;
      
    // Call the create user function
    var checkAdmin;
    if (!!data.isAdmin) {
      checkAdmin = "Y";
    } else {
      checkAdmin = "N";
    }

    if(!/^[A-Za-z0-9\._]+$/.test(data.userName)){
      const errors = { ...this.state.errors };
      errors.userName = "User names format error";
      this.setState({ errors });
      return;
    }

    this.setLoaderShowOff(true);

    userService
      .createUser({
        displayName: data.displayName,
        username: data.userName.toLocaleLowerCase(),
        password: data.newpassword,
        email: data.email,
        isAdmin: checkAdmin
      })
      .then(response => {
        pushAlert({
          type: 'message',
          title: i18n.t('common.create-success'),
          content: i18n.t('user.create-success'),
          callbackFn: () => {
            this.props.history.replace("/users");
          }
        });
      })
      .finally(()=>{
        this.setLoaderShowOff(false);
      })
      .catch(err => {
        this.catchError(err);
      });
  };

  checkData = (e) => {
    let errors = {};
    const { data } = this.state;
    if(!/^[a-z0-9\._]+$/.test(data.userName)){
      errors.userName = "User names format error";
    }
    return errors;
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
          this.state.isLoading && <Loader />
        }
        <div className="middle-content">
          <div className="inner-container">
            <form onSubmit={(e) => this.handleSubmit(e, this.checkData)}>
              <div className="signin-form-head new-user-head text-center">
                <img
                  src="/images/icon/user-big.svg"
                  className="big-icon"
                />
                <h2>{i18n.t('user.new-user')}</h2>
              </div>
              <div className="input-group">
                {this.renderInput(
                  "userName",
                  i18n.t('user.name'),
                  "/images/icon/user.png"
                )}
              </div>

              <div className="input-group">
                {this.renderInput(
                  "displayName",
                  i18n.t('user.display-name'),
                  "/images/icon/username.png"
                )}
              </div>

              <div className="input-group">
                {this.renderInput(
                  "email",
                  i18n.t('user.email'),
                  "/images/icon/email.png"
                )}
              </div>

              {/* Administrator enable/disable field */}
              <div className="wrap-div disable-group">
                {/* Administrator label with checkbox data start*/}
                <div className="input-group checkbox-wrap right-check">
                  <div className="input-group-prepend">
                    <span className="input-group-text" />
                  </div>
                  {this.renderCheckbox(
                    "isAdmin",
                    "Administrator",
                    "common-checkbox"
                  )}
                  <label
                    className="input-field form-control admin-label"
                    htmlFor="isAdmin"
                  >
                    <div className="administratorbg">
                      <div className="administrator-image" />
                    </div>
                    {i18n.t('user.set-to-admin')}
                  </label>
                </div>
              </div>

              <div className="input-group">
                {this.renderInput(
                  "newpassword",
                  i18n.t('user.new-password'),
                  "/images/icon/password.png",
                  "password"
                )}
              </div>

              <div className="input-group">
                {this.renderInput(
                  "confirmpassword",
                  i18n.t('user.conf-password'),
                  "/images/icon/password.png",
                  "password"
                )}
              </div>

              <div className="form-btn">
                <button className="btn btn-red btn-create w-100 text-center">
                  {i18n.t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
        {this.state.newalert}
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    pushAlert: (data) => dispatch(actions.pushAlert(data)),
  };
};

export default connect(null, mapDispatchToProps)(Index);
