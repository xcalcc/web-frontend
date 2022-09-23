import React, {Component} from "react";
import * as utils from "Utils";

export default class LicenseError extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){

    return (
      <React.Fragment>
        <div className="signin-form-head login-form-head text-center"> 
          <img src={utils.getThemeImg("warning.svg")} className="big-icon" />
          <h2>{utils.language("SORRY, LICENSE IS NOT VALID")}</h2>
          <p dangerouslySetInnerHTML={{__html: this.props.errorMsg}}></p>
          <p>
            {utils.language("please contact our technical support at")}&nbsp;
            <a href="mailto:support@xcalibyte.com">support@xcalibyte.com</a> 
            {utils.language("guide_get_technical_support")}
          </p>
        </div>
      </React.Fragment>
    )
  }
}