import React from "react";
import { connect } from 'react-redux';
import * as actions from 'Actions';
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import Joi from "joi-browser";
import moment from 'moment';
import i18n from 'i18next';
import * as utils from "Utils";
import Form from "Common/form";
import userService from "ToDeprecateServiceFolder/userService";
import Loader from 'Components/Loader';
import './style.scss';

class Index extends Form {
  constructor() {
    super();
    this.hideAlert = this.hideAlert.bind(this);

    let username = utils.localStore.get("username") || "";
    let password = utils.localStore.get("p") || "";
    let remember = utils.localStore.get("remember") || "";
    let isRemember = false;
    if (Number(remember) === 1) {
      isRemember = true;
    }

    this.state = {
      version: "",
      data: { 
        username,
        password,
        isRemember
      },
      showPassword: false,
      loginSuccessful: false,
      errors: {},
      newalert: null,
      isLoading: false
    };
  }

  // Defined the schema for validations
  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password"),
    isRemember: Joi.any().allow("")
  };

  async componentDidMount() {
    const { fetchVersion } = this.props;
    const responseData = await fetchVersion();
    let app = responseData.app || {};
    this.setState({
      version: app.version
    });
  }

  doSubmit = async () => {
    // Call the server
    const { data } = this.state;
    const { fetchLicense, login, pushAlert } = this.props;
    try {
      // Call the login function
      this.setLoaderShowOff(true);
      const responseData = await login(data.username, data.password);

      if(responseData.error) {
        this.catchError(responseData.error);
        this.setLoaderShowOff(false);
        return;
      }

      utils.localStore.set("username", data.username);
      utils.localStore.set("p", data.password);
      utils.localStore.set("tokenType", responseData.tokenType);
      utils.localStore.set("accessToken", responseData.accessToken);

      if (data.isRemember) {
        utils.localStore.set("remember", 1);
      } else {
        utils.localStore.remove("remember");
        utils.localStore.remove("p");
      }

      this.setState({
        loginSuccessful: true
      });

      userService.getCurrentUserInfo().then(async (response) => {
        const userData = response.data;
        utils.localStore.set("displayname", userData.displayName);
        utils.localStore.set("isAdmin", userData.isAdmin === 'Y');

        const responseData = await fetchLicense();
        if(responseData.error) {
          let data = responseData.error.response.data || {};
          if (data.responseCode === 404) {
            window.location = "/setup";
          } else {
            this.catchError(responseData.error);
          }
          this.setLoaderShowOff(false);
          return;
        }

        const licenseData = responseData;
        if (licenseData.licenseNumber) {
          let url = utils.urlRedirect.get();
          window.location = url ? url : "/dashboard";
        } else {
          window.location = "/setup";
        }
      })
      .catch(err => {
        this.catchError(err);
        this.setLoaderShowOff(false);
      });
    } catch (err) {
      this.setLoaderShowOff(false);

      let data = err.response.data || {};
      if (data.responseCode === 403) {
        pushAlert({
          type: 'message',
          title: i18n.t('error.error'),
          content: i18n.t('error.validation.user.invalid-user-or-password'),
        });
      }
    }
  };

  togglePassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  }

  setLanguage = () => {
    let current_lang = localStorage.getItem("language");
    let lang = (!current_lang || current_lang === "en") ? "zh-CN" : "en";

    localStorage.setItem("language", lang);
    window.location = "/";
  };

  setLoaderShowOff (isLoading) {
    this.setState({
      ...this.state,
      isLoading,
    });
  }

  render() {
    const licenseInfo = <div
        dangerouslySetInnerHTML={{__html: i18n.t('common.sidebar.license-info', {
            version: this.state.version,
            currentYear: moment().year()
        })}}
    />;

    return (
      <div className={classNames("login-page-bg", {chinese: utils.isChinese()})}>
        {
          this.state.isLoading && <Loader />
        }
        <div className="login-page ">
          <div className="login-box">
            {/* logo icon and url */}
            <div>
              <NavLink to="/login">
                <img
                  src={
                    utils.isEnglish()
                      ? "/images/logo-login.png"
                      : "/images/logo-login-cn.png"
                  }
                />
              </NavLink>
            </div>
            {/* form design login */}
            <div className="login-form">
              <div className="language">
                <a href="#" onClick={this.setLanguage}>
                  <span>{utils.language("lng")}</span>
                  <img
                    src={utils.getThemeImg("chnage-language.png")}
                    alt={utils.language("chnage_language")}
                  />
                </a>
              </div>
              <form onSubmit={this.handleSubmit}>
                {/* username input field */}
                <div className="input-group login-username">
                  {this.renderInput(
                    "username",
                    utils.language("u_name"),
                    "/images/icon/user.png"
                  )}
                </div>
                {/* password input field */}
                <div className="input-group login-password">
                  {this.renderInput(
                    "password",
                    utils.language("pass"),
                    "/images/icon/password.png",
                    this.state.showPassword ? "text" : "password"
                  )}
                  <span 
                    className="toggle-password"
                    onClick={this.togglePassword}
                  >
                    <img
                      src="/images/icon/eye-close-up.png"
                      alt={utils.language("show_hide_password")}
                    />
                  </span>
                </div>
                {/* checkbox and remember me */}
                <div className="input-group login-remember">
                  <label className="custom-checkbox">
                    {utils.language("rem_me")}
                    {this.renderCheckbox("isRemember", utils.language("rem_me"))}
                    <span className="checkmark" />
                  </label>
                  {/* <a href="/" className="forget_password">
                    {utils.language("f_pass")}
                  </a> */}
                </div>
                {/* login button */}
                <button className="btn btn-red log_in_btn">
                  <span className="btn-icon">
                    <img src="/images/icon/login.png" />
                  </span>
                  <span className="icon-text">{utils.language("login")}</span>
                  {
                    this.state.loginSuccessful &&
                    <img className="check-login" src="/images/icon/login-right.png" />
                  }
                </button>
              </form>
            </div>
            {/* copyright text */}
            <div className="copyright">
              <div className="xcal-name">
                <img
                  src={
                    utils.isEnglish()
                      ? "/images/logo-footer.png"
                      : "/images/logo-footer-cn.svg"
                  }
                />
              </div>
              {licenseInfo}
            </div>
          </div>
        </div>
        {this.state.newalert}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    pushAlert: (data) => dispatch(actions.pushAlert(data)),
    login: (username, password) => dispatch(actions.login(username, password)),
    fetchVersion: () => dispatch(actions.fetchVersion()),
    fetchLicense: () => dispatch(actions.fetchLicense()),
  };
};

export default connect(null, mapDispatchToProps)(Index);
