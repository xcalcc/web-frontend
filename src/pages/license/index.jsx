import React from 'react';
import { connect } from 'react-redux';
import * as actions from 'Actions';
import {Container} from 'react-bootstrap';
import * as utils from 'Utils';
import i18n from 'i18next';
import userService from 'ToDeprecateServiceFolder/userService';
import ReactFileReader from 'react-file-reader';
import Form from 'Common/form';
import Loader from 'Components/Loader';

import './style.scss';

class License extends Form {
  constructor(props) {
    super(props);
    this.timeout = 0;

    this.state = {
      user_total: "-",
      errors: {},
      user_id: "",
      product_name: '',
      company_name: "",
      license_number: "",
      expires: "",
      max_users: "",
      isLoading: false
    };
  }

  componentDidMount() {
    this.getLicenseData();
    this.getUserData();
  }

  getLicenseData = async () => {
    this.setLoaderShowOff(true);

    const {fetchLicense} = this.props;

    const responseData = await fetchLicense();

    this.setLoaderShowOff(false);

    if(responseData.error) {
      this.catchError(responseData.error);
      return;
    }

    const license = responseData;
    const company_name = license.companyName;
    const product_name = license.productName || "爱科识C/C++扫描软件[简称: XcalScan C/C++] 1.0";
    const license_number = license.licenseNumber;
    const max_users = license.maxUsers;
    const curdate = utils.parseDate(license.expiresOn);
    const expires = utils.dateFormat(curdate, (utils.isChinese() ? "yyyy/MM/dd hh:mm:ss" : "dd/MM/yyyy hh:mm:ss"));

    this.setState({ 
      company_name, 
      product_name, 
      expires, 
      license_number, 
      max_users 
    });
  }

  getUserData = () => {
    userService
    .getUserList({
      page: 0,
      size: 1
    })
    .then(response => {
      const data = response.data || {};
      this.setState({
        user_total: data.totalElements
      });
    })
    .catch(err => {
      this.catchError(err);
    });
  }

  handleFiles = async (files) => {
    const {uploadLicense, pushAlert} = this.props;
    if (/\.(license)$/i.test(files[0].name)) {
      this.setLoaderShowOff(true);
      let formData = new FormData();
      formData.append("upload_file", files[0]);
      const responseData = await uploadLicense(formData);

      this.setLoaderShowOff(false);

      if(responseData.error) {
        this.catchError(responseData.error);
        return;
      }

      const license = responseData;
      const company_name = license.companyName;
      const product_name = license.productName;
      const license_number = license.licenseNumber;
      const max_users = license.maxUsers;
      const curdate = utils.parseDate(license.expiresOn);
      const expires = utils.dateFormat(curdate, (utils.isChinese() ? "yyyy/MM/dd hh:mm:ss" : "dd/MM/yyyy hh:mm:ss"));
      this.setState({ company_name, product_name, expires, license_number, max_users });

      pushAlert({
        type: 'message',
        title: i18n.t('common.update-success'),
        content: i18n.t('pages.license.update-success'),
      });
    }
    return false;
  };

  setLoaderShowOff (isLoading) {
    this.setState({
      ...this.state,
      isLoading,
    });
  }

  render() {
    const {
      user_total,
      company_name,
      product_name,
      expires,
      license_number,
      max_users
    } = this.state;

    return (
      <Container fluid className="license-page">
        {
          this.state.isLoading && <Loader />
        }
        <div className="middle-content">
          <div className="inner-container admin-screen">
            <div className="signin-form-head text-center">
              <img
                src="/images/icon/administration-icon.svg"
                className="big-icon"
              />
              <h2>{utils.language("administration")}</h2>
            </div>

              <div className="license-upload-div">
                <div className="box-left">
                  <div className="license-label">
                    {i18n.t('pages.license.license')}:
                  </div>
                </div>
                <div className="box-right">
                  <div className="d-flex flex-row justify-content-between">
                    <div className="admin-left">
                      <div>
                        <span>{i18n.t('pages.license.customer-name')}:</span>
                        <strong>{company_name}</strong>
                      </div>
                      <br/>
                      <div>
                        <span>{i18n.t('pages.license.product-name')}:</span>
                        <strong>{product_name}</strong>
                      </div>
                    </div>
                    <div className="admin-center">
                      <div className="admin-center-top">
                        <div>
                          <span>{utils.language("license_number")}:</span>
                          <strong>{license_number}</strong>
                        </div>
                      </div>
                      <div className="admin-center-bottom">
                        <div>
                          <span>{utils.language("expires")}:</span>
                          <strong>{expires}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="admin-right">
                      <ReactFileReader
                        handleFiles={this.handleFiles}
                        fileTypes={".license"}
                      >
                        <button className="btn btn-gray btn-update-license text-center">
                          {utils.language("update_licence")}
                        </button>
                      </ReactFileReader>
                      <div className="admin-right-bottom">
                        <span> {utils.language("users")}: </span>
                        <strong>
                          {user_total}/{max_users}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="clearfix" />
              </div>
          </div>
        </div>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    pushAlert: (data) => dispatch(actions.pushAlert(data)),
    fetchLicense: () => dispatch(actions.fetchLicense()),
    uploadLicense: (formData) => dispatch(actions.uploadLicense(formData)),
  };
};

export default connect(null, mapDispatchToProps)(License);
