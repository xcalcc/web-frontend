import React from "react";
import marked from "marked";
import Form from "Common/form";

class Marked extends Form {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      output: ""
    };
  }

  componentDidMount() {
    
  }

  handleChange = (e) => {
    this.setState({
      input: e.target.value,
      output: marked(e.target.value)
    });
  }

  render() {
    return (
      <div className="solid-bg">
        <div>
          <div className="container">
            <section className="main-section">
              <div className="sidebar-data">
                <div className="middle-content">
                  <div className="inner-container admin-screen">
                    <div className="signin-form-head text-left">
                      <h2 style={{textTransform:"initial"}}>Markdown</h2>
                    </div>
                    input:<textarea
                      style={{
                        border:"1px solid #ccc",
                        width: "100%",
                        height: "150px"
                      }}
                      value={this.state.input}
                      onChange={this.handleChange}
                    >
                    </textarea>
                    output:
                    <div 
                      style={{
                        border:"1px solid #ccc",
                        width: "100%",
                        height: "200px",
                        overflow: "scroll"
                      }}
                      dangerouslySetInnerHTML={{__html: this.state.output}}
                    >
                    </div>
                    <div 
                      style={{
                        border:"1px solid #ccc",
                        width: "100%",
                        height: "200px",
                        marginTop:"10px"
                      }}
                    >
                      {this.state.output}
                    </div>
                </div>
                </div>
              </div>
              <div className="clearfix" />
            </section>
            <div className="clearfix" />
          </div>
        </div>
      </div>
    );
  }
}

export default Marked;
