import React from 'react';
import { connect } from 'react-redux';
import * as actions from 'Actions';
import classNames from 'classnames';
import i18n from 'i18next';
import enums from 'Enums';
import * as utils from 'Utils';
import Form from 'Common/form';
import Pagination from 'Components/Pagination';
import Loader from 'Components/Loader';
import ConfirmPrompt from 'Containers/ConfirmPrompt';
import IconBackCircle from 'Images/icon/back-circle-gray.png';
import './style.scss';

const DEFAULT_PAGE_SIZE = 12;

class HistoryList extends Form {
  constructor(props) {
    super(props);
    this.state = {
      scanTaskId: null,
      deleteType: null,
      isShowAlert: false,
      scanTaskList: null,
      totalPages: 0,
      tablePaging: {
        currentPage: 1,
        pageSize: DEFAULT_PAGE_SIZE
      },
      projectUuid: props.match.params.projectkey,
      isLoading: false
    };
  }

  DELETE_TYPE = {
    SINGLE: 1,
    ALL: 2
  }

  componentDidMount() {
    this.getScanTaskList();
  }

  async getScanTaskList(){
    this.setLoaderShowOff(true);

    const { fetchScanTasks } = this.props;

    const { 
      tablePaging,
      projectUuid
    } = this.state;

    const responseData = await fetchScanTasks({
        projectUuid,
        page: tablePaging.currentPage - 1,
        size: tablePaging.pageSize,
      });

    this.setLoaderShowOff(false);

    if(responseData.error) {
      this.catchError(responseData.error);
      return;
    }

    this.setState({
      scanTaskList: responseData.content || [],
      totalPages: responseData.totalPages || 0
    });
  }

  handlePageChange = (page, event) => {
    let {tablePaging} = this.state;
    tablePaging.currentPage = page;

    this.setState({tablePaging}, () => {
      this.getScanTaskList();
    });
  }

  handlePageSizeChange = (pageSize, event) => {
    let tablePaging = {
      pageSize: pageSize,
      currentPage: 1
    };

    this.setState({tablePaging}, () => {
      this.getScanTaskList();
    });
  }

  handleDownloadLog = async (scanTaskId) => {
    this.setLoaderShowOff(true);

    const { downloadLogFile } = this.props;

    const response = await downloadLogFile(scanTaskId);

    this.setLoaderShowOff(false);

    if(response.error) {
      let blob = new Blob([response.error.response.data], {type : 'application/json'});

      let reader = new FileReader();
      reader.readAsText(blob);
      reader.onload = () => {
        let text = reader.result;
        if(utils.isJsonString(text)){
          let data = JSON.parse(text) || {};
          this.catchError(data.message);
        } else {
          this.catchError("File not found");
        }
      }
      reader.onerror = (e) => {
        this.catchError("File not found");
      };
      return;
    }

    let blob = new Blob([response.data]);
    let url = window.URL.createObjectURL(blob);

    let downloadElement = document.createElement("a");
        downloadElement.href = url;

    let headerContent = response.headers['content-disposition'];
    let fileName = `scan_task_log_${+new Date()}.zip`;

    if (headerContent) {
      let match = headerContent.match(/filename=(.+)/);
      if(match[1]){
        fileName = match[1].replace(/"/g, '');
      }
    }

    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(url);
  }

  handleDeleteScanTask = (scanTaskId) => {
    this.setState({
      scanTaskId,
      isShowAlert: true,
      deleteType: this.DELETE_TYPE.SINGLE
    });
  }

  handleDeleteAllScanTask = () => {
    this.setState({
      isShowAlert: true,
      deleteType: this.DELETE_TYPE.ALL
    });
  }

  handleDelete = () => {
    if(this.state.deleteType === this.DELETE_TYPE.ALL) {
      this.deleteAllScanTask();
    } else {
      this.deleteScanTaskById(this.state.scanTaskId);
    }
  }

  deleteScanTaskById = async (scanTaskId) => {
    this.setLoaderShowOff(true);
    this.hideDeleteAlert();

    const { deleteScanTask, pushAlert } = this.props;

    const responseData = await deleteScanTask(scanTaskId);

    this.setLoaderShowOff(false);

    if(responseData.error) {
      this.catchError(responseData.error);
      return;
    }

    this.getScanTaskList();

    pushAlert({
      type: 'message',
      title: i18n.t('common.delete'),
      content: i18n.t('common.operation-success'),
    });
  }

  deleteAllScanTask = async () => {
    this.setLoaderShowOff(true);
    this.hideDeleteAlert();
    const {projectUuid} = this.state;
    const {deleteAllScanTask, pushAlert} = this.props;

    const responseData = await deleteAllScanTask(projectUuid);

    this.setLoaderShowOff(false);

    if(responseData.error) {
      this.catchError(responseData.error);
      return;
    }

    this.getScanTaskList();

    pushAlert({
      type: 'message',
      title: i18n.t('common.delete'),
      content: i18n.t('common.operation-success'),
    });
  }

  goBack() {
    this.props.history.goBack();
  }

  setLoaderShowOff (isLoading) {
    this.setState({
      ...this.state,
      isLoading,
    });
  }

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

  render() {
    const {
      scanTaskList,
      tablePaging,
      totalPages
    } = this.state;
    const projectName = scanTaskList && (scanTaskList[0] || {}).projectName;
    let dataFmt = utils.isChinese() ? "yyyy/MM/dd hh:mm:ss" : "dd/MM/yyyy hh:mm:ss";

    return (
      <div className="scan-history-page">
        {
          this.state.isLoading && <Loader />
        }
        <div>
          <div className="container">
            <section className="main-section">
              <div className="sidebar-data">
                <div className="back-link">
                  <a href="javascript:void(0)" onClick={() => this.goBack()}>
                    <img src={IconBackCircle}/>
                  </a>
                </div>
                <div className="middle-content">
                  <div className="inner-container admin-screen">
                    <div className="signin-form-head text-left">
                      <h2>扫描记录 &nbsp;|&nbsp; {projectName}</h2>
                    </div>
                    <div style={{position:"absolute",right: 0,fontSize:"10px",top:"10px"}}>
                      <a href="javascript:" onClick={this.handleDeleteAllScanTask}>删除所有记录</a>
                    </div>
                    <div style={{minHeight:"400px"}}>
                      <table className="table-list" style={{width:"100%",fontSize:"11px",lineHeight:"30px"}}>
                        <thead style={{background:"#efefef"}}>
                          <tr>
                            <th className="text-center">ID</th>
                            <th>扫描时间</th>
                            <th>结束时间</th>
                            <th>扫描状态</th>
                            <th>创建人</th>
                            <th className="text-center">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scanTaskList && scanTaskList.length === 0 && (
                            <tr className="no-data">
                              <td colSpan="5">{utils.language("Search result not found")}</td>
                            </tr>
                          )}
                          {
                            scanTaskList && scanTaskList.map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  style={{borderBottom:"1px solid #efefef"}}
                                >
                                  <td>{item.id}</td>
                                  <td>{utils.dateFormat(utils.parseDate(item.createdOn), dataFmt)}</td>
                                  <td>{utils.dateFormat(utils.parseDate(item.modifiedOn), dataFmt)}</td>
                                  <td>
                                    {
                                      item.status === enums.SCAN_TASK_STATUS.completed
                                        ? item.status
                                        : <span className={classNames({
                                          'red-txt': item.status === enums.SCAN_TASK_STATUS.failed,
                                          'green-txt': item.status !== enums.SCAN_TASK_STATUS.failed,
                                        })}>{item.status}</span>
                                    }
                                  </td>
                                  <td>{item.modifiedBy}</td>
                                  <td className="text-center initialism">
                                    <a href="javascript:" onClick={()=>this.handleDownloadLog(item.id)}>下载日志</a>
                                    {
                                      item.status === enums.SCAN_TASK_STATUS.completed && 
                                      <a 
                                        className="offset-1"
                                        target="_blank"
                                        href={`/project/${item.projectId}/scan/${item.id}`} 
                                      >
                                        查看结果
                                      </a>
                                    }
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <a href="javascript:" onClick={()=>this.handleDeleteScanTask(item.id)}>删除</a>
                                  </td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
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
                </div>
              </div>
              <div className="clearfix" />
            </section>
            <div className="clearfix" />
          </div>
        </div>
        <ConfirmPrompt
            show={this.state.isShowAlert}
            title={i18n.t('common.are-you-sure')}
            cancelBtnText={i18n.t('common.buttons.cancel')}
            confirmBtnText={i18n.t('common.delete-it')}
            contentText={i18n.t('common.delete-tip')}
            onConfirm={this.handleDelete}
            onCancel={() => this.hideDeleteAlert()}
            onHide={() => this.hideDeleteAlert()}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    pushAlert: (data) => dispatch(actions.pushAlert(data)),
    fetchScanTasks: (filter) => dispatch(actions.fetchScanTasks(filter)),
    downloadLogFile: (scanTaskId) => dispatch(actions.downloadLogFile(scanTaskId)),
    deleteScanTask: (scanTaskId) => dispatch(actions.deleteScanTask(scanTaskId)),
    deleteAllScanTask: (projectUuid) => dispatch(actions.deleteAllScanTask(projectUuid)),
  };
};

export default connect(null, mapDispatchToProps)(HistoryList);
