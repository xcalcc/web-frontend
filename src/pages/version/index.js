import React from "react";
import http from "ToDeprecateServiceFolder/httpService";
import * as utils from "Utils";

export default class Index extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){    
    http.get('/version.json')
      .then(response => {
        let data = response.data || {};

        let commit_date = "";
        let build_date = "";

        if(data.commit_date){
          commit_date = utils.dateFormat(utils.parseDate(data.commit_date), "yyyy/MM/dd hh:mm:ss");
        }
        if(data.build_date){
          build_date = utils.dateFormat(utils.parseDate(data.build_date), "yyyy/MM/dd hh:mm:ss");
        }

        this.setState({
          commit_id: data.commit_id,
          commit_branch: data.commit_branch,
          commit_date: commit_date,
          build_date: build_date,
        });
      })
      .catch(e => {});
  }

  render(){
    let styleObj = {
      padding: "10px",
      lineHeight: "20px",
      fontSize: "18px"
    };

    return (
      <pre style={styleObj}>
        <p>commit branch: {this.state.commit_branch}</p>
        <p>commit id: {this.state.commit_id}</p>
        <p>commit date: {this.state.commit_date}</p>
        <p>build date: {this.state.build_date}</p>
      </pre>
    )
  }
}