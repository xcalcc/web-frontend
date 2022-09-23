import React from "react";
import { connect } from 'react-redux';
import * as actions from 'Actions';
import i18n from 'i18next';
import * as utils from "Utils";
import enums from 'Common/enumeration';
import Form from "Common/form";
import LicenseSetting from "./LicenseSetting";
import LicenseSuccess from "./LicenseSuccess";
import LicenseError from "./LicenseError";
import EmailSetting from "./EmailSetting";
import UserList from "./UserList";
import UserSetting from "./UserSetting";
import Finish from "./Finish";
import './style.scss';

const STEP_STATUS = {
  LICENSE_SETTING: 1,
  LICENSE_SUCCESS: 1.1,
  LICENSE_ERROR: 1.2,
  EMAIL_SETTING: 2,
  USER_SETTING: 3,
  USER_LIST: 3.1,
  FINISH: 4
}

class Index extends Form {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: "",
      step: this.getCacheData(),
      newalert: null
    };

    this.hideAlert = this.hideAlert.bind(this);
  }

  componentDidMount(){

  }

  getCacheData(){
    let step = sessionStorage.getItem(enums.GUIDE_CACHE_ID);

    if(utils.isEmpty(step)){
      step = STEP_STATUS.LICENSE_SETTING;
    }

    step = Number(step);

    let exists = false;
    for(let key in STEP_STATUS){
      if(step === STEP_STATUS[key]){
        exists = true;
      }
    }

    if(!exists){
      step = STEP_STATUS.LICENSE_SETTING;
    }

    return step;
  }

  setCacheData(){
    sessionStorage.setItem(enums.GUIDE_CACHE_ID, this.state.step);
  }

  handleSkip = () => {
    sessionStorage.removeItem(enums.GUIDE_CACHE_ID);
    this.props.history.replace("/dashboard");
  }

  handleSetStep = (step, errorMsg) => {
    this.setState({
      step: step,
      errorMsg: errorMsg
    }, () => {
      this.setCacheData();
    });
  }

  showAlert = (msg) => {
    const { pushAlert } = this.props;
    pushAlert({
      type: 'message',
      title: i18n.t('error.error'),
      content: msg,
    });
  }

  handlePreviousStep = () => {
    let previousStep = null;
    const step = this.state.step;
    switch(step){
      case STEP_STATUS.FINISH:
        previousStep = STEP_STATUS.USER_LIST;
        break;
      case STEP_STATUS.USER_LIST:
        previousStep = STEP_STATUS.USER_SETTING;
        break;
      case STEP_STATUS.USER_SETTING:
        previousStep = STEP_STATUS.EMAIL_SETTING;
        break;
      case STEP_STATUS.EMAIL_SETTING:
        previousStep = STEP_STATUS.LICENSE_SETTING;
        break;
      case STEP_STATUS.LICENSE_SUCCESS:
      case STEP_STATUS.LICENSE_ERROR:
        previousStep = STEP_STATUS.LICENSE_SETTING;
        break;
      default:
        previousStep = STEP_STATUS.LICENSE_SETTING;
        break;
    }

    this.handleSetStep(previousStep);
  }

  handleNextStep = () => {
    let nextStep = null;
    const step = this.state.step;
    switch(step){
      case STEP_STATUS.LICENSE_SUCCESS:
      case STEP_STATUS.LICENSE_ERROR:
        nextStep = STEP_STATUS.EMAIL_SETTING;
        break;
      case STEP_STATUS.EMAIL_SETTING:
        nextStep = STEP_STATUS.USER_SETTING;
        break;
      case STEP_STATUS.USER_SETTING:
        nextStep = STEP_STATUS.USER_LIST;
        break;
      case STEP_STATUS.USER_LIST:
        nextStep = STEP_STATUS.FINISH;
        break;
      default:
        nextStep = STEP_STATUS.LICENSE_SETTING;
        break;
    }

    this.handleSetStep(nextStep);
  }


  renderContent(){
    const step = this.state.step;
    let Element = null;
 
    switch(step){
      case STEP_STATUS.LICENSE_SETTING:
        Element = LicenseSetting;
        break;
      case STEP_STATUS.LICENSE_SUCCESS:
        Element = LicenseSuccess;
        break;
      case STEP_STATUS.LICENSE_ERROR:
        Element = LicenseError;
        break;
      case STEP_STATUS.EMAIL_SETTING:
        Element = EmailSetting;
        break;
      case STEP_STATUS.USER_SETTING:
        Element = UserSetting;
        break;
      case STEP_STATUS.USER_LIST:
        Element = UserList;
        break;
      case STEP_STATUS.FINISH:
        Element = Finish;
        break;
      default:
        Element = LicenseSetting;
        break;
    }
 
    return Element;
  }

  getStepClassName = (step) => {
    let className = null;
    const currentStep = this.state.step;

    if(currentStep >= (step + 1)){
      className = "completed-stap";
    }

    if(currentStep === step && currentStep === STEP_STATUS.FINISH){
      className = "completed-stap setup-completed ";
    }

    return className;
  }

  render(){
    const {step} = this.state;
    const {history} = this.props;

    const ContentElement = this.renderContent();

    return (
      <div className="solid-bg setup-guide-page">
        <div className="main-wrapper">
          <div className="container">
            <header className="header">
              <div className="header-logo">
                <a href="#" title={utils.language("product_name")}>
                  <img src={utils.getThemeImg("logo.png")} alt={utils.language("product_name")} />
                </a>
              </div>
              <div className="clearfix"></div>
            </header>
            <section className="main-section login-main-section">
              <div className="sidebar-data login-sidebar-right">
                <div className="scanning-middle-content d-flex flex-row justify-content-between">
                  <div className="login-left-box">
                    <div className="btn-login-back">
                      <a 
                        title={utils.language("back")}
                        href="#" 
                        onClick={this.handlePreviousStep}
                      >
                        <img src="/images/icon/login-back-icon.jpg" alt={utils.language("back")} />
                      </a>
                    </div>
                    <div className="inner-container admin-screen">
                        <ContentElement 
                          history={history}
                          STEP_STATUS={STEP_STATUS} 
                          errorMsg={this.state.errorMsg}
                          showAlert={this.showAlert}
                          onSetStep={this.handleSetStep} 
                          onSkip={this.handleSkip}
                          onNextStep={this.handleNextStep}
                        />
                    </div>
                  </div>
                  <div className="login-right-list">
                    <ul>
                      <li className={this.getStepClassName(STEP_STATUS.LICENSE_SETTING)}>
                        {utils.language("STEP 1")}
                        <span>{utils.language("Import License")}</span>
                        <div className="check-image"><img src={utils.getThemeImg("complete-check.png")} /></div>
                      </li>
                      <li className={this.getStepClassName(STEP_STATUS.EMAIL_SETTING)}>
                        {utils.language("STEP 2")}
                        {step >= STEP_STATUS.EMAIL_SETTING && <span>{utils.language("Set Up Email Server")}</span>}
                        <div className="check-image"><img src={utils.getThemeImg("complete-check.png")} /></div>
                      </li>
                      <li className={this.getStepClassName(STEP_STATUS.USER_SETTING)}>
                        {utils.language("STEP 3")}
                        {step >= STEP_STATUS.USER_SETTING && <span>{utils.language("User Management")}</span>}
                        <div className="check-image"><img src={utils.getThemeImg("complete-check.png")} /></div>
                      </li>
                      {
                        step === STEP_STATUS.FINISH && 
                        <li className={this.getStepClassName(STEP_STATUS.FINISH)}>
                          {utils.language("SET UP COMPLETE")}
                          <div className="check-image"><img src={utils.getThemeImg("complete-check.png")} /></div>
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              </div>
              <div className="clearfix"></div>
            </section>
            <div className="clearfix"></div>
          </div>
        </div>
        {this.state.newalert}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    pushAlert: (data) => dispatch(actions.pushAlert(data)),
  };
};

export default connect(null, mapDispatchToProps)(Index);
