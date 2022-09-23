import React from 'react';
import { Col, Row, ProgressBar} from 'react-bootstrap';
import PropTypes from 'prop-types';
import "./index.scss";
import { regresionTitle, deltaScanResultTitles } from "Pages/DSR-Dashboard/variable";
import {checkLanguage} from "Pages/DSR-Dashboard/services";

export default function ProgressBarReg(props){
    const {title,
        defectReg,
        value1,
        value2,
        labelVal1,
        labelval2,
        defectToolTip,
        language} = props;

  const {thisRemaining, thisSeverity} = regresionTitle

    return(
      <Col className="px-0">
        <Row className="mx-0 py-small align-items-center">
          <Col sm={1} className="px-0 text-left x-lg semi-bold darker-grey mr-1">
            {title}
          </Col>
          <div className="tooltip-container">
            <div className="info-dot">i</div>
            <div className="tooltip-content">
              <Col className="tooltip-content-container">
                <Col className="box-tooltips-toolip-bar">
                  {defectToolTip}
                </Col>
                <Col className="line-toolip-bar" />
                <div className="small-circle-tooltip dots hidden-sm" />
              </Col>
            </div>
          </div>
          <Col
            lg={2}
            className={`px-0 ml-2 rounded text-center md-1 lp-1 shadow br-10 remaining ${  defectReg === 0 ? 'dark-grey bc-grey': 'dark-grey text-white bg-success'}`}
          >
            {checkLanguage(language, thisRemaining)} 
            {' '}
            {defectReg}
          </Col>
          <Col className="mt-1">
            <ProgressBar>
              <ProgressBar
                variant="info"
                now={value1}
                key={3}
                className="text-left px-1 br-10 mb-1"
              />
              <ProgressBar
                // label={`${checkLanguage(language, thisRemaining)  }${  labelVal1}`}
                label={`${checkLanguage(language, thisRemaining)  } ${  labelVal1}`} 
                className="fixed-label bold"
              />
            </ProgressBar>
            <ProgressBar>
              <ProgressBar
                variant="danger"
                now={value2}
                key={3}
                className="text-left px-1 br-10 mb-1 obo-progress-bar"
              />
              <ProgressBar
                label={`${checkLanguage(language, deltaScanResultTitles.thisNew)  }${  labelval2}`}
                className="new-label bold"
              />
              <div id='e'>
                <ProgressBar>
                  <Col className="position-absolute tooltips-max-w">
                    <Col className="box-tooltips-bar">
                      {checkLanguage(language, thisSeverity)}
                      {' '}
                      : 2
                      {checkLanguage(language, deltaScanResultTitles.thisHigh)}
                    </Col>
                    <Col className="line-bar" />
                    <div className="small-circle-bar hidden-sm" />
                  </Col>
                </ProgressBar>
              </div>
            </ProgressBar>
          </Col>
        </Row>
        <Row className="button-b">
          <svg width="100%" height="3" xmlns="http://www.w3.org/2000/svg">
            <path id="path" d="M18 0 h 515" />
          </svg>
        </Row>

      </Col>
    )
}

ProgressBarReg.defaultProps = {
  title : '',
  value1:0,
  value2:0,
  labelVal1:'',
  labelval2:'',
  defectToolTip:'',
  defectReg:0
}

ProgressBarReg.propTypes = {
    title : PropTypes.objectOf(PropTypes.any),
    defectReg : PropTypes.objectOf(PropTypes.any),
    value1 : PropTypes.objectOf(PropTypes.any),
    value2 : PropTypes.objectOf(PropTypes.any),
    labelVal1 : PropTypes.objectOf(PropTypes.any),
    labelval2 : PropTypes.objectOf(PropTypes.any),
    defectToolTip : PropTypes.objectOf(PropTypes.any),
}
