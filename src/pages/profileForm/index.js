import React from "react";
import { connect } from 'react-redux';
import * as actions from 'Actions';
import {Container} from 'react-bootstrap';
import $ from "jquery";
import * as utils from "Utils";
import Joi from "joi-browser";
import i18n from 'i18next';
import Form from "Common/form";
import userService from "ToDeprecateServiceFolder/userService";
import Loader from 'Components/Loader';

class Index extends Form {
  constructor(props) {
    super(props);
    this.timeout = 0;

    this.state = {
      data: {
        user_id: "",
        display_name: "",
        isAdmin: "",
        username: "",
        email: "",
        oldpassword: "",
        newpassword: "",
        confirmpassword: "",
      },
      errors: {},
      isLoading: false
    };
  }

  schema = {
    display_name: Joi.string()
      .required()
      .max(15)
      .label("Name"),
    email: Joi.string()
      .email()
      .max(256)
      .required()
      .label("Email"),
    oldpassword: Joi.string()
      .optional()
      .allow("")
      .min(5)
      .label("Old Password"),
    newpassword: Joi.any().when("oldpassword", {
      is: Joi.string().exist(),
      then: Joi.string().min(6)
    }),
    confirmpassword: Joi.any().when("oldpassword", {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  };

  doSubmit = async () => {
    const errors = { ...this.state.errors };
    const { data } = this.state;
    const { pushAlert } = this.props;

    if(!utils.isEmpty(data.newpassword) && utils.isEmpty(data.oldpassword)){
      errors.oldpassword = i18n.t('error.validation.user.enter-the-old-password');
      this.setState({ errors });
      return;
    }

    let temp = 0;
    if (!utils.isEmpty(data.oldpassword)) {
      if (data.newpassword !== data.confirmpassword) {
        errors.confirmpassword = i18n.t('error.validation.user.password-do-not-match');
        this.setState({ errors });
        temp = 1;
      } else {
        await userService
          .updatePassword({
            id: data.user_id,
            oldPassword: data.oldpassword,
            newPassword: data.newpassword
          })
          .then(response => {
            utils.localStore.set("p", utils.encode(data.newpassword));
          })
          .catch(err => {
            this.setLoaderShowOff(false);
            const _errors = { ...this.state.errors };
            let _data = err.response.data || {};
            errors.oldpassword = _data.localizedMessage || _data.message;
            this.setState({ errors: _errors });
            temp = 1;
          });
      }
    }

    if (temp === 0) {
      this.setLoaderShowOff(true);
      await userService
        .updateUser({
          id: data.user_id,
          username: data.username,
          email: data.email,
          displayName: data.display_name,
          isAdmin: data.isAdmin
        })
        .then(response => {
          this.setLoaderShowOff(false);

          let userData = response.data;
          utils.localStore.set("displayname", userData.displayName);

          pushAlert({
            type: 'message',
            title: i18n.t('common.update-success'),
            content: i18n.t('user.profile-update-success'),
          });
          $("#oldpassword").val("");
          $("#newpassword").val("");
          $("#confirmpassword").val("");
        })
        .catch(err => {
          this.catchError(err);
        });
    }
  };

  componentDidMount() {
    this.setLoaderShowOff(true);
    userService
      .getCurrentUserInfo()
      .then(response => {
        const userDetails = response.data;
        const data = { ...this.state.data };
        data.user_id = userDetails.id;
        data.username = userDetails.username;
        data.display_name = userDetails.displayName;
        data.email = userDetails.email;
        data.isAdmin = userDetails.isAdmin;
        this.setState({ data });
      })
      .finally(() => {
        this.setLoaderShowOff(false);
      })
      .catch(err => {
        this.catchError(err);
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
          this.state.isLoading && <Loader />
        }
        <div className="middle-content">
          <div className="inner-container">
            <form onSubmit={this.handleSubmit}>
              <div className="signin-form-head text-center">
                <img
                  src="/images/icon/profile.svg"
                  className="big-icon"
                />
                <h2>{i18n.t('user.profile')}</h2>
              </div>
              <div className="wrap-div disable-group">
                {/*  Name label data start*/}
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <img
                        src="/images/icon/username.png"
                        alt={i18n.t('user.name')}
                      />
                    </span>
                  </div>
                  <label className="input-field form-control">
                    {utils.localStore.get("username")}
                  </label>
                  {this.state.data.isAdmin === "Y" && (
                    <div className="user-type">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <img src="/images/icon/admin-sign.png" />
                        </span>
                        {i18n.t('user.admin')}
                      </div>
                    </div>
                  )}
                </div>
                {/* Name label data end*/}
              </div>
              <div className="input-group">
                {this.renderInput(
                  "display_name",
                  i18n.t('user.display-name'),
                  "/images/icon/user.png"
                )}
              </div>
              <div className="input-group">
                {this.renderInput(
                  "email",
                  i18n.t('user.email'),
                  "/images/icon/email.png",
                  "email"
                )}
              </div>
              <div className="input-group">
                {this.renderInput(
                  "oldpassword",
                  i18n.t('user.old-password'),
                  "/images/icon/password.png",
                  "password"
                )}
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
                <button className="btn btn-red btn-block text-center">
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

