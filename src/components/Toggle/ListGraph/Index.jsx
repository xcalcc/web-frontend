import React from 'react';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import './Index.scss';
import { Row, Col } from 'react-bootstrap';
// import setting from '../../../assets/image/setting.png';
import { UPDATED_REGRETION, DEFAULT_REGRETION } from 'ToDeprecateServiceFolder/ApiServices/variable';
import { REGRETION_ACTION } from 'ToDeprecateServiceFolder/ApiServices/actions';
import { regresionTitle } from "Pages/DSR-Dashboard/variable";
import {checkLanguage} from "Pages/DSR-Dashboard/services";

function CustomizedSwitches({ language, handle, loadRegretions, resetRegretions, navExpand }) {

  const {thisRegresion, thisList, thisGraph} = regresionTitle

  const [state, setState] = React.useState(false);

  const handleChange = (event) => {
    setState(!state);
    handle(state);
  };

  const graphOnClick = () => {
    handleChange(!state);
    setTimeout(() => loadRegretions(), 200);
  };

  const listOnClick = () => {
    handleChange(!state);
    resetRegretions();
  };
  return (
    <Row className="mx-0 justify-content-between">
      <Col lg={6} className="px-0">
        <p className={`bold right-title lg lp-1 ${ language === 'cn' ? 'font-cn-bold' : null}`}>{checkLanguage(language, thisRegresion)}</p>
      </Col>
      <div className="right px-0 mb-2 toggle-w ">
        <Toggle checked={state} onChange={handleChange} label="Toggle Compare" />

        <Col className={`label-switch-btn px-0 ${ navExpand ? 'w-5' : 'w-7'}`}>
          <div className={`bold  ${ language === 'cn' ? 'font-cn f-1-small ml-cn' : 'f-1'}`} onClick={() => listOnClick()}>
            {checkLanguage(language, thisList)}
          </div>
          <div className={`bold ${ language === 'cn' ? 'font-cn f-1-small mr-cn' : 'f-1'}`} onClick={() => graphOnClick()}>
            {checkLanguage(language, thisGraph)}
          </div>
        </Col>
      </div>
    </Row>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadRegretions: () => dispatch(REGRETION_ACTION(UPDATED_REGRETION)),
    resetRegretions: () => dispatch(REGRETION_ACTION(DEFAULT_REGRETION)),
  };
};

export default connect(null, mapDispatchToProps)(CustomizedSwitches);
