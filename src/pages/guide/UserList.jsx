import React from "react";
import * as utils from "Utils";
import userService from "ToDeprecateServiceFolder/userService";
import Form from "Common/form";
import Pagination from 'Components/Pagination';
import Loader from 'Components/Loader';
import './user-list.scss';

const DEFAULT_PAGE_SIZE = 10;

export default class UserList extends Form{
  constructor(props){
    super(props);
    this.state = {
      users: [],
      totalPages: 0,
      tablePaging: {
        currentPage: 1,
        pageSize: DEFAULT_PAGE_SIZE
      },
      newalert: null,
      isLoading: false
    };

    this.hideAlert = this.hideAlert.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
  }

  componentDidMount() {
    this.getUserListData();
  }

  getUserListData(){
    this.setLoaderShowOff(true);
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
      })
      .finally(() => {
        this.setLoaderShowOff(false);
      })
      .catch(err => {
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
  setLoaderShowOff (isLoading) {
    this.setState({
      ...this.state,
      isLoading,
    });
  }

  render(){
    const {
      users,
      tablePaging,
      totalPages
    } = this.state;

    return (
      <React.Fragment>
        {
          this.state.isLoading && <Loader />
        }
        <div className="signin-form-head login-form-head text-center"> 
          <h4>3</h4>   
        </div>
        <div className="guide-user-list-wrap">
          <ul className="user-member-head">
            <li>{utils.language("display_name")}:</li>
            <li>{utils.language("user_name")}:</li>
            <li>{utils.language("email_address")}:</li>
          </ul>
          <div className="user-member-listing">
            {users.map(user => (
              <div key={user.id} className="user-member-row d-flex flex-row">
                <div className="first-block member-td">{user.displayName}</div>
                <div className="second-block member-td">{user.username}</div>
                <div className="third-block member-td">{user.email}</div>
              </div>
            ))}
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
        <div className="btn-other-login three-login-btn text-center">
          <button 
            type="button" 
            className="btn btn-red text-center"
            onClick={this.props.onNextStep}
          >
            {utils.language("NEXT")}
          </button>
        </div>
        {this.state.newalert}
      </React.Fragment>
    )
  }
}