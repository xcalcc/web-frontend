import React from "react";
import * as utils from "Utils";
import enums from "Common/enumeration";
import "./style.css";

const DEV_SETTING_OPTIONS = [
  {
    title: "查看历史扫描记录",
    value: enums.DEV_MODE_OPTION.viewScanHistoryRecord
  },
  {
    title: "解锁锁定的用户",
    value: enums.DEV_MODE_OPTION.userUnlock
  },
  {
    title: "查看validation完整功能",
    value: enums.DEV_MODE_OPTION.validation
  }
];

export default class DevSetting extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      settingData: {}
    };
  }

  componentDidMount(){
    let settingData = this.getCacheData();
    if(utils.isEmptyObject(settingData)){
      DEV_SETTING_OPTIONS.forEach(item => {
        settingData[item.value] = 1;
      });

      utils.setDevModeOption(settingData);
    }

    this.setState({settingData});
  }

  getCacheData(){
    return utils.getDevModeOption() || {};
  }

  handleChange = (event) => {
    let { settingData } = this.state;

    let option = event.target.value;
    let isEnable = event.target.checked ? 1 : 0;

    settingData[option] = isEnable;
    utils.setDevModeOption(settingData);

    this.setState({settingData});
  }

  render() {
    let { settingData } = this.state;

    return (
      <div className="middle-content">
          <div className="dev-setting-box">
            <ul>
              {
                DEV_SETTING_OPTIONS.map((item, index) => {
                  return (
                    <li key={index}>
                      <label>
                        <input 
                          type="checkbox" 
                          value={item.value}
                          checked={settingData[item.value] === 1}
                          onChange={this.handleChange}
                        />
                        {item.title}
                      </label>
                    </li>
                  )
                })
              }
            </ul>
          </div>
          {this.state.newalert}
      </div>
    );
  }
}