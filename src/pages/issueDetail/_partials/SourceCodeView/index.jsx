import React, {useState, useEffect} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux';
import {useRouteMatch} from 'react-router-dom';
import * as actions from 'Actions';
import * as utils from 'Utils';
import Loader from 'Components/Loader';
import TracePath from '../TracePath';
import TracePathDescription from '../TracePathDescription';
import SourceCode from './SourceCode/SourceCode';
import {SourceCodeProvider} from './SourceCodeProvider';
import SourceCodeDataAdapter from "./SourceCodeDataAdapter";

import './style.scss';

const SourceCodeView = props => {
    const {
        currentPathIndex,
        onChangePathIndex
    } = props;
    const dispatch = useDispatch();
    const routeMatch = useRouteMatch();
    const scanTaskId = routeMatch.params.scanTaskId;

    const userConfig = useSelector(state => state.user.userConfig);
    const issueGroup = useSelector(state => state.issues.issueGroup);
    const issueList = useSelector(state => state.issues.issueList);

    const [isLoading, setIsLoading] = useState(false);
    const [tracePathNodes, setTracePathNodes] = useState();
    const [fileDataList, setFileDataList] = useState();
    const [{nodeIndex1, nodeIndex2}, setNodeIndex] = useState({});
    const [{focusLineNo1, focusLineNo2}, setFocusLineNo] = useState({});
    const [{sourceCodeData1, sourceCodeData2}, setSourceCodeData] = useState({});

    const fetchSourceCode = ({scanTaskId, dsrType, filePath, linesLimit}) => dispatch(actions.fetchScanFile({scanTaskId, dsrType, filePath, linesLimit}));

    const onSelectedTracePathNode = selectedNodeIndexs => {
        _setSourceCodeData(selectedNodeIndexs, tracePathNodes, fileDataList);
    }

    const _setSourceCodeData = (selectedNodeIndexs, _tracePathNodes, _fileDataList) => {
        // source and sink are displayed by default
        selectedNodeIndexs = selectedNodeIndexs || [0, _tracePathNodes.length - 1];

        const index1 = selectedNodeIndexs[0];
        const index2 = selectedNodeIndexs[1];

        const nodeData1 = (!utils.isEmpty(index1) && _tracePathNodes[index1]) || {};
        const nodeData2 = (!utils.isEmpty(index2) && _tracePathNodes[index2]) || {};

        const sourceData1 = _fileDataList.find(file => file.file === nodeData1.file) || {};
        const sourceData2 = _fileDataList.find(file => file.file === nodeData2.file) || {};


        setNodeIndex({
            nodeIndex1: selectedNodeIndexs[0],
            nodeIndex2: selectedNodeIndexs[1]
        });
        setFocusLineNo({
            focusLineNo1: nodeData1 && nodeData1.lineNo,
            focusLineNo2: nodeData2 && nodeData2.lineNo
        });
        setSourceCodeData({
            sourceCodeData1: sourceData1,
            sourceCodeData2: sourceData2
        });
    }

    useEffect(() => {
        (async () => {
            if(utils.isEmpty(currentPathIndex) || utils.isEmpty(issueGroup) || issueList.length === 0) return;

            setIsLoading(true);
            const issue = (issueList[currentPathIndex]) || {};

            // load the source code for all files in the trace path
            const sourceCodeProvider = new SourceCodeProvider({fetchSourceCode});
            const _tracePathNodes = await sourceCodeProvider.provide({
                scanTaskId,
                dsrType: issueGroup.dsr,
                tracePathNodes: issue.tracePath || [],
                codeDisplayLines: userConfig.configNumCodeDisplay
            });

            // get render data
            const _fileDataList = new SourceCodeDataAdapter().getDataForFullPath(_tracePathNodes);

            setFileDataList(_fileDataList);
            setTracePathNodes(_tracePathNodes);
            _setSourceCodeData(null, _tracePathNodes, _fileDataList);

            setIsLoading(false);
        })();
    }, [currentPathIndex, issueGroup, issueList]);

    return <Container className="source-code-view noPadding" fluid>
        {isLoading && <Loader />}
        <Row noGutters>
            <Col xs={3} className="left-block">
                <TracePath
                    isSourceCodeView={true}
                    pathIndex={currentPathIndex}
                    tracePathNodes={tracePathNodes}
                    allPathCount={issueList.length}
                    minimumPathNum={1}
                    onChangePathIndex={onChangePathIndex}
                    onSelectedNode={onSelectedTracePathNode}
                />
            </Col>
            <Col xs={9} className="right-block">
                <TracePathDescription 
                    desc={issueList[currentPathIndex] && issueList[currentPathIndex].description} 
                    isOverflowHide={false}
                />
                <div className="source-code-wrap">
                    <SourceCode
                        nodeIndex={nodeIndex1}
                        fileData={sourceCodeData1}
                        selectedLineNo={focusLineNo1}
                        className="source-code-half-height"
                    />
                    <SourceCode
                        nodeIndex={nodeIndex2}
                        fileData={sourceCodeData2}
                        selectedLineNo={focusLineNo2}
                        className="source-code-half-height"
                    />
                </div>
            </Col>
        </Row>
    </Container>;
}

export default SourceCodeView;