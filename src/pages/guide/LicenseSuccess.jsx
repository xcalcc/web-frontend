import React, {Component} from "react";
import * as utils from "Utils";

export default class LicenseSuccess extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){

    return (
      <React.Fragment>
        <div className="signin-form-head login-form-head text-center"> 
          <img src="/images/icon/success.svg" className="big-icon" />
          <h2>{utils.language("THANKS, LICENSE HAS BEEN SUCCESSFULLY IMPORTED")}</h2>
          <p>{utils.language("Now we’re going to take you through 3 simple steps to set up Xcalscan")}</p>
        </div>
        <div className="btn-other-login text-center">
          <button 
            type="button" 
            className="btn btn-red text-center"
            onClick={this.props.onNextStep}
          >
            {utils.language("NEXT")}
          </button>
        </div>
        <div className="login-massage login-success-massage">
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