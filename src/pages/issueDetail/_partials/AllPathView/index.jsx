import React, {useState, useMemo, useEffect} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import i18n from 'i18next';
import * as utils from 'Utils';
import enums from 'Enums';
import TracePath from '../TracePath';
import TracePathDescription from '../TracePathDescription';
import ExecutionPathGraph from "./ExecutionPathsGraph/ExecutionPathsGraph";

import './style.scss';

const AllPathView = props => {
    const {
        onTracePathClick
    } = props;

    const issueGroup = useSelector(state => state.issues.issueGroup);
    const issueList = useSelector(state => state.issues.issueList);

    const [hoveredPathIndex, setHoveredPathIndex] = useState(-1);
    const [hoveredTracePathNodes, setHoveredTracePathNodes] = useState(null);
    const [nodeOrEdgeHovered, setNodeOrEdgeHovered] = useState(false);

    const isMultipleSink = useMemo(() => utils.issueTraceHelper.isMultiple(issueList, 'sink'), [issueList]);

    const setHoveredData = _hoveredPathIndex => {
        setHoveredPathIndex(_hoveredPathIndex);

        if (utils.isEmpty(_hoveredPathIndex) || _hoveredPathIndex < 0 || _hoveredPathIndex >= issueList.length) {
            setHoveredTracePathNodes(null);
        } else {
            const issue = issueList[_hoveredPathIndex] || {};
            setHoveredTracePathNodes(issue.tracePath);
        }
    }

    const onGraphExecutionPathClick = pathIndex => {
        onTracePathClick && onTracePathClick(pathIndex);
    };

    const onSelectedTracePathNode = (selectedNodeIndexs, pathIndex) => {
        onTracePathClick && onTracePathClick(pathIndex);
    }

    const sourceCodeRemark = issueGroup.dsr === enums.DSR_TYPE.FIXED 
                                ? i18n.t('issueDetail.fix-issue-source-code-tip') 
                                : i18n.t('issueDetail.new-issue-source-code-tip');

    useEffect(() => {
        setHoveredPathIndex(-1);
        setHoveredTracePathNodes(null);
        setNodeOrEdgeHovered(false);
    }, [issueGroup]);

    if(!issueList || issueList.length === 0) return null;

    return <Container className="all-path-view noPadding" fluid>
        <Row noGutters>
            <Col xs={3} className="left-block">
                <TracePath
                    pathIndex={hoveredPathIndex}
                    tracePathNodes={hoveredTracePathNodes}
                    nodeOrEdgeHovered={nodeOrEdgeHovered}
                    allPathCount={issueList.length}
                    minimumPathNum={0}
                    onChangePathIndex={setHoveredData}
                    onSelectedNode={onSelectedTracePathNode}
                />
            </Col>
            <Col xs={9} className="right-block">
                <TracePathDescription 
                    desc={issueList[hoveredPathIndex] && issueList[hoveredPathIndex].description} 
                    isOverflowHide={true}
                    sourceCodeRemark={sourceCodeRemark}
                />
                <div className="trace-path-graph">
                    {
                        issueList.length <= enums.TRACE_PATH_MAX_NUMBER_OF_DISPLAY ?
                        <ExecutionPathGraph
                            isMultipleSink={isMultipleSink}
                            selectedPathIndex={hoveredPathIndex}
                            executionPathsData={issueList}
                            onGraphExecutionPathClick={onGraphExecutionPathClick}
                            setNodeOrEdgeHovered={setNodeOrEdgeHovered}
                            setHoveredPathIndex={setHoveredData}
                        /> :
                        <p className="no-graph">{i18n.t('issueDetail.no-graph')}</p>
                    }
                </div>
            </Col>
        </Row>
    </Container>;
}

export default AllPathView;