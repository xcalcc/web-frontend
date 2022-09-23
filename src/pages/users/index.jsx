import React from "react";
import { connect } from 'react-redux';
import * as actions from 'Actions';
import {Container} from 'react-bootstrap';
import { Link } from "react-router-dom";
import Scrollbar from 'react-scrollbars-custom';
import * as utils from "Utils";
import i18n from 'i18next';
import userService from "ToDeprecateServiceFolder/userService";
import ReactFileReader from "react-file-reader";
import Form from "Common/form";
import Pagination from 'Components/Pagination';
import Loader from 'Components/Loader';
import ConfirmPrompt from 'Containers/ConfirmPrompt';

import './style.scss';

const DEFAULT_PAGE_SIZE = 10;

class Users extends Form {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      user_id: "",
      users: [],
      totalPages: 0,
      tablePaging: {
        currentPage: 1,
        pageSize: DEFAULT_PAGE_SIZE
      },
      isLoading: false,
      isShowAlert: false
    };
    this.deleteUser = this.deleteUser.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
  }

  componentDidMount() {
    this.setLoaderShowOff(true);

    this.getUserListData();
  }

  getUserListData(alertData){
    const { pushAlert } =  this.props;
    const { tablePaging } = this.state;

    userService
      .getUserDetailList({
        page: tablePaging.currentPage - 1,
        size: tablePaging.pageSize,
      })
      .then(response => {
        const data = response.data || {};
        this.setState({ 
          users: data.content || [],
          totalPages: data.totalPages || 0
        });

        if(alertData){
          pushAlert(alertData);
        }
      })
      .finally(() => {
        this.setLoaderShowOff(false);
      })
      .catch(err => {
        this.catchError(err);
      });
  }

  deleteUser() {
    this.setLoaderShowOff(true);

    const alertData = {
      type: 'message',
      title: i18n.t('common.delete'),
      content: i18n.t('user.user-has-deleted'),
    };

    const { user_id } = this.state;

    userService
      .deleteUser(user_id)
      .then(response => {
        const tablePaging = {
          currentPage: 1,
          pageSize: DEFAULT_PAGE_SIZE
        };
        this.setState({tablePaging}, () => {
          this.getUserListData(alertData);
        });
      })
      .finally(() => {
        this.hideDeleteAlert();
      })
      .catch(err => {
        this.setLoaderShowOff(false);
        this.catchError(err);
      });
  }

  handlePageChange(page, event){
    let {tablePaging} = this.state;
    tablePaging.currentPage = page;

    this.setState({tablePaging}, () => {
      this.getUserListData();
    });
  }

  handlePageSizeChange(pageSize, event){
    let tablePaging = {
      pageSize: pageSize,
      currentPage: 1
    };

    this.setState({tablePaging}, () => {
      this.getUserListData();
    });
  }

  handleFiles = files => {
    this.setLoaderShowOff(true);

    const alertData = {
      type: 'message',
      title: i18n.t('user.imported'),
      content: i18n.t('user.import-success'),
    };

    let formData = new FormData();
    formData.append("upload_file", files[0]);
    userService
      .importUsers(formData)
      .then(response => {
        const tablePaging = {
          currentPage: 1,
          pageSize: DEFAULT_PAGE_SIZE
        };
        this.setState({tablePaging}, () => {
          this.getUserListData(alertData);
        });
      })
      .catch(err => {
        this.setLoaderShowOff(false);
        this.catchError(err);
      });
    return false;
  };

  showDeleteAlert = userId => {
    this.setState({
      user_id: userId,
      isShowAlert: true
    });
  };

  hideDeleteAlert = () => {
    this.setState({
      isShowAlert: false
    });
  }

  catchError = error => {
    const { pushAlert } =  this.props;
    pushAlert({
      type: 'error',
      title: i18n.t('error.error'),
      content: utils.getApiMessage(error),
    });
  }

  setLoaderShowOff (isLoading) {
    this.setState({
      ...this.state,
      isLoading,
    });
  }

  render() {
    const {
      users,
      tablePaging,
      totalPages
    } = this.state;

    return (
      <Container fluid className="user-list-page">
        {
          this.state.isLoading && <Loader />
        }
        <div className="middle-content">
          <div className="inner-container admin-screen">
            <div className="signin-form-head text-center">
              <img src="/images/icon/user-admin.svg" className="big-icon" />
              <h2>{i18n.t('user.user-admin')}</h2>
            </div>

            <div>
                <ul className="box-list-head">
                  <li>{i18n.t('user.display-name')}</li>
                  <li>{i18n.t('user.name')}</li>
                  <li>{i18n.t('user.email-address')}</li>
                  <li>{i18n.t('user.role')}</li>
                  <li>{i18n.t('common.action')}</li>
                </ul>
                <div className="box-list-body">
                  <div className="user-listing">
                    <Scrollbar noScrollX>
                      {users.map(userdetails => (
                        <div
                          key={userdetails.id}
                          className="user-info-row d-flex flex-row justify-content-between"
                        >
                          <div className="first-block user-td">
                            {userdetails.displayName}
                          </div>
                          <div className="second-block user-td">
                            {userdetails.username}
                          </div>
                          <div className="third-block user-td">
                            {userdetails.email}
                          </div>
                          <div className="fourth-block user-td">
                            {userdetails.isAdmin === "Y" && (
                              <img src="/images/icon/admin-sign.png" />
                            )}
                            {userdetails.isAdmin === "Y" &&
                              i18n.t('user.admin')}
                          </div>
                          <div className="fifth-block user-td">
                            <a 
                              className="sweet-5"
                              onClick={() => {
                                this.showDeleteAlert(userdetails.id);
                              }}
                            >
                              <img
                                src="/images/icon/close.png"
                                alt={i18n.t('common.delete')}
                              />{" "}
                            </a>
                            <Link to={`user/${userdetails.id}/update`}>
                              {utils.language("edit")}
                            </Link>
                          </div>
                          <div className="clearfix" />
                        </div>
                      ))}
                    </Scrollbar>
                  </div>
                  <div className="table-pagination">
                    {
                      totalPages>0 && 
                      <Pagination 
                        totalPages={totalPages}
                        currentPage={tablePaging.currentPage}
                        pageSize={tablePaging.pageSize}
                        onPageChange={this.handlePageChange}
                        onPageSizeChange={this.handlePageSizeChange}
                      />
                    }
                  </div>
                </div>
                <div className="clearfix" />
                <div className="action-button-admin">
                  <Link
                    to="/create-user"
                    className="btn btn-gray btn-reset btn-add-team-member text-center"
                  >
                    {i18n.t('user.add-user')}
                  </Link>
                  <div className="upload-button uploard-team">
                    <div className="input-file-container">
                      <ReactFileReader
                        handleFiles={this.handleFiles}
                        fileTypes={".csv"}
                      >
                        <span className="attech-doc">
                          <img src="/images/icon/upload-icon.png" />
                          {i18n.t('user.import-user')}
                        </span>
                      </ReactFileReader>
                    </div>
                  </div>
                  <a href="/images/template.csv" download>
                    <button className="btn-template">
                      <img src="/images/icon/team-template.png" />
                      <span>{i18n.t('user.team-template')}</span>
                    </button>
                  </a>
                </div>
            </div>
          </div>
        </div>
        <ConfirmPrompt
            show={this.state.isShowAlert}
            title={i18n.t('common.are-you-sure')}
            cancelBtnText={i18n.t('common.buttons.cancel')}
            confirmBtnText={i18n.t('common.delete-it')}
            contentText={i18n.t('common.delete-tip')}
            onConfirm={this.deleteUser}
            onCancel={() => this.hideDeleteAlert()}
            onHide={() => this.hideDeleteAlert()}
        />
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    pushAlert: (data) => dispatch(actions.pushAlert(data)),
  };
};

export default connect(null, mapDispatchToProps)(Users);
