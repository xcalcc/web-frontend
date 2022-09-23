import React from "react";
import ReactFileReader from "react-file-reader";
import i18n from 'i18next';
import Form from "Common/form";
import userService from "ToDeprecateServiceFolder/userService";
import * as utils from "Utils";
import Loader from 'Components/Loader';
import './user-setting.scss';

export default class UserSetting extends Form{
  constructor(props){
    super(props);
    this.state = {
      userList: [
        {guid:new Date().getTime() + 1, showPassword: false},
        {guid:new Date().getTime() + 2, showPassword: false},
        {guid:new Date().getTime() + 3, showPassword: false}
      ],
      successUserList:[],
      isLoading: false
    };
  }

  handleAddUserElement = () => {
    let {userList} = this.state;
    userList.push({guid:new Date().getTime()});

    this.setState({ userList });
  }

  handleChange = (e, index) => {
    let input = e.target;
    let { userList } = this.state;
    let field = input.name;
    userList[index][field] = input.value;
    userList[index]["isAdmin"] = "N";
    this.setState({ userList });
  }

  togglePassword = (index) => {
    let { userList } = this.state;
    userList[index]["showPassword"] = !userList[index]["showPassword"];
    this.setState({ userList });
  }

  handleSubmit = () => {
    let okList = [];
    const {userList, successUserList} = this.state;
    userList.forEach(item => {
      if(!utils.isEmpty(item.username) && 
         !utils.isEmpty(item.displayName) && 
         !utils.isEmpty(item.password) && 
         utils.isEmail(item.email)){
          okList.push(item);
      }
    });

    if(okList.length === 0){
      if(successUserList.length === 0){
        this.props.showAlert(i18n.t('error.validation.user-info-input-error'));
      } else {
        this.props.onNextStep();
      }
    }

    if(okList.length > 0){
      this.addUserList(okList);
    }
  }

  handleImportUsers = (files) => {
    this.setLoaderShowOff(true);

    let formData = new FormData();
    formData.append("upload_file", files[0]);
    userService
      .importUsers(formData)
      .then(response => {
        this.props.onNextStep();
      })
      .finally(() => {
        this.setLoaderShowOff(false);
      })
      .catch(err => {
        let message = utils.getApiMessage(err);
        this.props.showAlert(message);
      });
    return false;
  };

  addUserList = (userList) => {
    this.setLoaderShowOff(true);
    userService
      .addUserList(userList)
      .then(response => {
        this.props.onNextStep();
      })
      .finally(() => {
        this.setLoaderShowOff(false);
      })
      .catch(err => {
        let message = utils.getApiMessage(err);
        this.props.showAlert(message);
      });
  }

  renderDefaultInput = (index, item) => {
    return (
      <div key={item.guid} className="join-field d-flex flex-row justify-content-between">
        <div className="input-group">
          <input 
            type="text" 
            className="input-field form-control" 
            placeholder={utils.language("username")}
            name="username" 
            onChange={event => this.handleChange(event, index)}
          />
        </div>
        <div className="input-group">
          <input 
            type="text" 
            className="input-field form-control" 
            placeholder={utils.language("display_name")}
            name="displayName" 
            onChange={event => this.handleChange(event, index)}
          />
        </div>
        <div className="input-group">
          <input 
            type="email" 
            className="input-field form-control" 
            placeholder={utils.language("email_address")}
            name="email" 
            onChange={event => this.handleChange(event, index)}
          />
        </div>
        <div className="input-group">
          <input 
            type={item.showPassword ? "text" : "password"} 
            className="input-field form-control" 
            placeholder={utils.language("pass")} 
            name="password" 
            onChange={event => this.handleChange(event, index)}
          />
          <span 
            className="toggle-password"
            onClick={() => this.togglePassword(index)}
          >
            <img src="/images/icon/eye-close-up.png" alt={utils.language("show_hide_password")} />
          </span>
        </div>
      </div>
    )
  }

  renderSuccessInput = (index, user) => {
    return (
      <div key={index} className="join-field d-flex flex-row justify-content-between">
        <div className="input-group">
          <input 
            type="text" 
            disabled={true}
            value={user.username}
            className="input-field form-control gray" 
            name="username" 
          />
        </div>
        <div className="input-group">
          <input 
            type="text" 
            disabled={true}
            value={user.displayName}
            className="input-field form-control gray" 
            name="displayName" 
          />
        </div>
        <div className="input-group">
          <input 
            type="email" 
            disabled={true}
            value={user.email}
            className="input-field form-control gray" 
            name="email" 
          />
        </div>
        <div className="input-group">
          <input 
            type="password" 
            disabled={true}
            value={user.password}
            className="input-field form-control gray" 
            name="password" 
          />
          <span className="toggle-password">
            <img src="/images/icon/eye-close-up.png" alt={utils.language("show_hide_password")} />
          </span>
        </div>
      </div>
    )
  }
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
          <h4>3</h4>
          <h2>{utils.language("PLEASE INVITE YOUR TEAM MEMBERS TO JOIN")}</h2>
          <p dangerouslySetInnerHTML={{__html: utils.language("Simply invite the team below or import a team list")}}></p>
        </div>
        <div className="guide-new-user-wrap text-center">
          <div className="join-data">
            {
              this.state.successUserList.map((item, index) => {
                return this.renderSuccessInput(index, item)
              })
            }
            {
              this.state.userList.map((item, index) => {
                return this.renderDefaultInput(index, item)
              })
            }
            <div className="add-join-user">
              <button 
                className="btn-add-join-user"
                onClick={this.handleAddUserElement}
              >
                {utils.language("ADD USER")}
              </button>
            </div>
          </div>
          <div className="action-button-join">
            <div className="upload-button uploard-team">
              <div className="input-file-container">
                <img src="/images/icon/team-template.png"/>
                <a href="/images/template.csv" download>
                  <span className="attech-doc">{utils.language("team_template")}</span>
                </a>
              </div>
            </div>
            
            <ReactFileReader
              handleFiles={this.handleImportUsers}
              fileTypes={".csv"}
            >
              <button type="reset" className="btn btn-gray btn-reset btn-add-team-member text-center">
              {utils.language("import_team")}
              </button>
            </ReactFileReader>
            <button 
              type="button" 
              className="btn btn-red"
              onClick={this.handleSubmit}
            >
              <span>{utils.language("NEXT")}</span>
            </button>
          </div>
        </div>
        <div className="login-massage login-email-massage">
          <p className="gray-txt">
            <a 
              href="#"
              onClick={this.props.onSkip}
            >
              {utils.language("NO, SKIP, I'LL DO IT LATER")}
            </a>
          </p>
        </div>
      </React.Fragment>
    )
  }
}