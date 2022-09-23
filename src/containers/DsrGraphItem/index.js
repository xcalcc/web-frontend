import React from 'react';
import {Row, Col, ProgressBar} from "react-bootstrap";
import {CircleFill} from 'react-bootstrap-icons';
import classNames from "classnames";
import TooltipWrapper from "Components/TooltipWrapper";
import NumberWithArrow from "Components/NumberWithArrow";
import i18n from 'i18next';
import * as utils from 'Utils';
import PropTypes from 'prop-types';

import './dsr-graph-item.scss';

const DsrProjectGraphItem = props => {
    const {
        data,
        handleClick,
    } = props;

    return <Row className="dsr-graph-item-project" onClick={handleClick}>
        <Col md={2} className="project-name-block">
            <Row>
                <Col className="project-name" xs={12}>
                    <span>{data.name}</span>
                </Col>
            </Row>
            <Row>
                <Col className="project-current-scan" xs={12}>
                    <span>{data.dsr.current}</span>
                </Col>
            </Row>
        </Col>
        <Col className="dsr-value" md={2}>
            <div>
                <NumberWithArrow
                    arrow={data.dsr.score.delta}
                    number={data.dsr.score.value}
                />
            </div>
        </Col>
        <Col className="fixed-new-bar align-self-center" md={7}>
            <Row>
                <Col>
                    <ProgressBar>
                        <ProgressBar
                            now={data.dsr.fixed.value}
                            className="text-left px-1 br-10 mb-1 issue-fixed-progress"
                        />
                        <ProgressBar
                            label={`${utils.language('fixed')} ${data.dsr.fixed.value}`}
                            className="label issue-fixed"
                        />
                    </ProgressBar>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ProgressBar>
                        <ProgressBar
                            now={data.dsr.new.value}
                            className="text-left px-1 br-10 mb-1 issue-new-progress"
                        />
                        <ProgressBar
                            label={`${utils.language('new')} ${data.dsr.new.value}`}
                            className="label issue-new"
                        />
                    </ProgressBar>
                </Col>
            </Row>
        </Col>
        <Col md={1} className="arrow"> > </Col>
    </Row>
}
const DsrIssueGraphItem = props => {
    const data = props.data;
    return <Row className="dsr-graph-item-issue">
        <Col md={2} className="project-name-block">
            <div className="name">{data.type}</div>
            <TooltipWrapper
                tooltipText={data.type}
            >
                <div className="tooltip-dot"><CircleFill /></div>
            </TooltipWrapper>
        </Col>
        <Col className="remaining-label text-left" md={2}>
            <div className={classNames('label-text',{
                revert: !!!data.remainIssueCount
            })}>
                <span>{i18n.t('pages.dsr.remaining')} </span><span>{data.remainIssueCount}</span>
            </div>
        </Col>
        <Col className="fixed-new-bar align-self-center" md={8}>
            <Row noGutters>
                <Col>
                    <ProgressBar>
                        <ProgressBar
                            now={data.fixedIssueCount}
                            className="text-left px-1 br-10 mb-1 issue-fixed-progress"
                        />
                        <ProgressBar
                            label={`${utils.language('fixed')} ${data.fixedIssueCount}`}
                            className="label issue-fixed"
                        />
                    </ProgressBar>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ProgressBar>
                        <ProgressBar
                            now={data.newIssueCount}
                            className="text-left px-1 br-10 mb-1 issue-new-progress"
                        />
                        <ProgressBar
                            label={`${utils.language('new')} ${data.newIssueCount}`}
                            className="label issue-new"
                        />
                    </ProgressBar>
                </Col>
            </Row>
        </Col>
    </Row>
}

const DsrGraphItem = props => {
    const item = (props.type === 'project' &&
        <DsrProjectGraphItem
            className='dsr-project-graph-item'
            data={props.data}
            handleClick={props.handleClick}
        />) ||
        <DsrIssueGraphItem
            className='dsr-issue-graph-item'
            data={props.data}
        />;
    return <div className="dsr-graph-item">
        {item}
    </div>;
}

DsrGraphItem.propTypes = {
    type: PropTypes.oneOf(['project', 'issue']).isRequired,
    handleClick: PropTypes.func
}

DsrGraphItem.defaultProp = {
    type: 'project',
    handleClick: () => {}
}

export default DsrGraphItem;
