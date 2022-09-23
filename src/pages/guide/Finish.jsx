import React, {Component} from "react";
import * as utils from "Utils";

export default class GuideFinish extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  handleClick = () => {
    this.props.history.replace("/dashboard");
  }

  render(){
    return (
      <React.Fragment>
        <div className="signin-form-head login-form-head text-center"> 
          <img src="/images/icon/success.svg" className="big-icon" />  
          <h2>{utils.language("SET UP COMPLETE")}</h2>
          <p>{utils.language("Xcalscan is ready to use")}</p>
        </div>
        <div className="btn-other-login text-center">
          <button 
            type="button" 
            className="btn btn-red text-center"
            onClick={this.handleClick}
          >
            {utils.language("Go to Dashboard")}
          </button>
        </div>
      </React.Fragment>
    )
  }
}