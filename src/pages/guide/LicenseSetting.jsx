import React,{Component} from "react";
import { connect } from 'react-redux';
import * as actions from 'Actions';
import ReactFileReader from "react-file-reader";
import * as utils from "Utils";
import Loader from 'Components/Loader';

class LicenseSetting extends Component{
  constructor(props){
    super(props);
    this.state = {
        isLoading: false
    };
  }

  handleFileUpload = async (files) => {
    const { uploadLicense } = this.props;
    if (/\.(license)$/i.test(files[0].name)) {
      this.setLoaderShowOff(true);
      var formData = new FormData();
      formData.append("upload_file", files[0]);

      const responseData = await uploadLicense(formData);

      this.setLoaderShowOff(false);

      if(responseData.error) {
        this.props.onSetStep(this.props.STEP_STATUS.LICENSE_ERROR, utils.getApiMessage(responseData.error));
      } else {
        this.props.onSetStep(this.props.STEP_STATUS.LICENSE_SUCCESS);
      }
    }
    return false;
  };
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
          <h4>1</h4>
          <h2>{utils.language("THANK YOU FOR CHOOSING XCALSCAN")}</h2>
          <p>{utils.language("To commence using Xcalscan, please import your license")}</p>
        </div>
        <div className="btn-other-login text-center">
          <ReactFileReader handleFiles={this.handleFileUpload} fileTypes={".license"}>
            <button type="button" className="btn btn-red text-center">
              {utils.language("Import License")}
            </button>
          </ReactFileReader>
        </div>
        <div className="login-massage">
          <p>{utils.language("If you haven’t received your license,")}</p>
          <p>
            {utils.language("please contact us at")}  
            <a href="mailto:support@xcalibyte.com">support@xcalibyte.com</a>
          </p>
        </div>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadLicense: (formData) => dispatch(actions.uploadLicense(formData)),
  };
};

export default connect(null, mapDispatchToProps)(LicenseSetting);
