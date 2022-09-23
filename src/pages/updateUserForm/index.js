import React from "react";
import { connect } from 'react-redux';
import * as actions from 'Actions';
import {Container} from 'react-bootstrap';
import $ from "jquery";
import Joi from "joi-browser";
import * as utils from "Utils";
import i18n from 'i18next';
import enums from 'Common/enumeration';
import Form from "Common/form";
import userService from "ToDeprecateServiceFolder/userService";
import Loader from 'Components/Loader';

class Index extends Form {
  // Initial constructor of the class
  constructor(props) {
    super(props);

    this.state = {
      data: {
        username: "",
        display_name: "",
        email: "",
        newpassword: "",
        isAdmin: false,
        isLock: false
      },
      newalert: null,
      errors: {},
      isLoading: false
    };
    this.hideAlert = this.hideAlert.bind(this);
  }

  // Defined the schema for validations
  schema = {
    username: Joi.string().required(),
    display_name: Joi.string()
      .required()
      .max(15)
      .label("Name"),
    email: Joi.string()
      .required()
      .email()
      .label("Email"),
    isAdmin: Joi.any().allow(""),
    newpassword: Joi.string()
      .allow("")
      .min(6)
      .label("Password"),
    confirmpassword: Joi.string()
      .valid(Joi.ref("newpassword"))
      .options({
        language: { any: { allowOnly: "!!Passwords do not match" } }
      })
  };

  async componentDidMount() {
    $(".action-link").click(function() {
      $(this)
        .prev(".input-group")
        .children(".input-field")
        .prop("disabled", false);
      $(this)
        .parent(".wrap-div")
        .removeClass("disable-group");
      //$(this).next(".action-button").slideDown("slow");
    });

    $(window).click(function() {
      $(".wrap-div").addClass("disable-group");
      $(".disable-group .input-field").attr("disabled", "disabled");
    });

    $(".disable-group .input-field,.action-link").click(function(event) {
      event.stopPropagation();
    });

    const { data } = this.state;
    const userId = this.props.match.params.login;

    this.setLoaderShowOff(true);
    userService
      .getUserInfo(userId)
      .then(response => {
        const userInfo = response.data;
        const copydata = { ...data };
        if (userInfo.isAdmin === "Y") {
          copydata.isAdmin = true;
        } else {
          copydata.isAdmin = false;
        }
        copydata.username = userInfo.username;
        copydata.display_name = userInfo.displayName;
        copydata.email = userInfo.email;
        this.setState({
          data: copydata
        });
      })
      .finally(() => {
        this.setLoaderShowOff(false);
      })
      .catch(err => {
        this.catchError(err);
      });
  }

  onUnlock(){
    const { pushAlert } = this.props;
    const userId = this.props.match.params.login;
    userService.unlockUser(userId)
    .then(response => {
      pushAlert({
        type: 'message',
        title: i18n.t('common.update-success'),
        content: i18n.t('user.unlock-success'),
      });
    })
    .catch(err => {
      this.catchError(err);
    });
  }

  doSubmit = async () => {
    // Call the server
    const errors = { ...this.state.errors };
    const { data } = this.state;
    const { pushAlert } = this.props;

    var temp = 0;

    if (
      data.newpassword !== undefined &&
      data.newpassword !== "" &&
      data.newpassword !== null
    ) {
      if (data.newpassword !== data.confirmpassword) {
        errors.confirmpassword = i18n.t('error.validation.user.password-do-not-match');
        this.setState({ errors });
        temp = 1;
      } else {
        const userId = this.props.match.params.login;
        await userService.updatePassword({
          id: userId,
          newPassword: data.newpassword
        })
        .catch(err => {
          this.catchError(err);
        });
      }
    }

    if (temp === 0) {
      try {
        var checkAdmin;
        if (data.isAdmin === true) {
          checkAdmin = "Y";
        } else {
          checkAdmin = "N";
        }

        await userService
          .updateUser({
            id: this.props.match.params.login,
            username: data.username,
            email: data.email,
            displayName: data.display_name,
            isAdmin: checkAdmin
          })
          .then(response => {
            let userData = response.data;
            let currentUserName = utils.localStore.get("username");
            if(userData.username === currentUserName){
              utils.localStore.set("isAdmin", userData.isAdmin === 'Y');
              utils.localStore.set("displayname", userData.displayName);
            }

            pushAlert({
              type: 'message',
              title: i18n.t('common.update-success'),
              content: i18n.t('user.user-update-success'),
              callbackFn: () => {
                this.props.history.replace("/users");
              }
            });
          });
      } catch (err) {
        this.catchError(err);
      }
    }
  };
  setLoaderShowOff (isLoading) {
    this.setState({
      ...this.state,
      isLoading,
    });
  }

  // Rendering the view
  render() {
    const { data } = this.state;
    return (
      <Container fluid>
        {
          this.state.isLoading && <Loader />
        }
        <div className="middle-content">
          <div className="inner-container">
            {/* Main title with icon image*/}
            <div className="signin-form-head new-user-head text-center">
              <img src="/images/icon/profile.svg" className="big-icon" />
              <h2>{i18n.t('user.profile')}</h2>
              <span>{i18n.t('user.admin-view')}</span>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="wrap-div disable-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <img src="/images/icon/username.png" />
                    </span>
                  </div>
                  <label
                    className="input-field form-control"
                    disabled="disabled"
                  >
                    {data.username}
                  </label>
                </div>
                {/* Name label data end*/}
              </div>
              <div className="wrap-div disable-group">
                {/* User name label data start*/}
                <div className="input-group">
                  {this.renderInput(
                    "display_name",
                    i18n.t('user.display-name'),
                    "/images/icon/user.png"
                  )}
                </div>
                <a
                  className="action-link action-text"
                  href="javascript:;"
                >
                  {i18n.t('common.edit')}
                </a>
                {/* User name label data end*/}
              </div>
              <div className="wrap-div disable-group">
                <div className="input-group">
                  {this.renderInput(
                    "email",
                    i18n.t('user.email'),
                    "/images/icon/email.png",
                    "email"
                  )}
                </div>
                <a
                  className="action-link action-text"
                  href="javascript:;"
                >
                  {i18n.t("common.edit")}
                </a>
              </div>
              {/* Administrator enable/disable field */}
              <div className="wrap-div disable-group">
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
                  {
                    utils.isEnableDevModeOption(enums.DEV_MODE_OPTION.userUnlock) &&
                    <a 
                      className="action-text" 
                      href="javascript:void(0);" 
                      style={{"textDecoration": "underline"}}
                      onClick={()=>this.onUnlock()}
                    >
                      {i18n.t('user.unlock')}
                    </a>
                  }
                </div>
              </div>
              {/* New password input field */}
              <div className="input-group">
                {this.renderInput(
                  "newpassword",
                  i18n.t('user.new-password'),
                  "/images/icon/password.png",
                  "password"
                )}
              </div>
              {/* Confirm password input field */}
              <div className="input-group">
                {this.renderInput(
                  "confirmpassword",
                  i18n.t('user.conf-password'),
                  "/images/icon/password.png",
                  "password"
                )}
              </div>
              {/* Save button */}
              <div className="form-btn">
                <button
                  type="submit"
                  className="btn btn-red btn-block text-center"
                >
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

