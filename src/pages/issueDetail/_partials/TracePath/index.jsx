import React, {useState, useMemo} from 'react';
import classNames from 'classnames';
import Scrollbar from 'react-scrollbars-custom';
import TipMessage from 'Components/TipMessage';
import i18n from 'i18next';
import * as utils from 'Utils';
import './style.scss';

const TracePath = ({isSourceCodeView, pathIndex, tracePathNodes, allPathCount, minimumPathNum, onChangePathIndex, onSelectedNode}) => {

    const pathNum = useMemo(() => pathIndex === '' ? '' : pathIndex+1, [pathIndex]);

    const handlePrevIndex = () => {
        if(pathIndex > -1) {
            setTracePathIndex(pathIndex - 1);
        }
    }

    const handleNextIndex = () => {
        if(pathIndex === '') {
            setTracePathIndex(-1);
        } else {
            setTracePathIndex(pathIndex + 1);
        }
    }

    const handleInputChange = e => {
        const value = e.target.value;
        if(value === '') {
            setTracePathIndex('');
        } else if(!isNaN(value)) {
            setTracePathIndex(e.target.value - 1);
        }
    }

    const setTracePathIndex = index => {
        if(index < -1 || index >= allPathCount) return;
        onChangePathIndex && onChangePathIndex(index);
    }

    return <div className="trace-path">
        <div className="trace-path__nav">
            <button 
                onClick={handlePrevIndex}
                className={classNames({disabled: pathNum <= minimumPathNum})}
            >&lt;</button>
            <div>
                <span className="title">{i18n.t('issueDetail.path')}</span>
                <input 
                    className="path-index" 
                    value={pathNum}
                    onChange={handleInputChange}
                ></input>
                <i>/</i>
                <span>{allPathCount}</span>
            </div>
            <div>
                <span className="title">{i18n.t('issueDetail.depth')}</span>
                <span>{tracePathNodes ? tracePathNodes.length : 0}</span>
            </div>
            <button 
                onClick={handleNextIndex}
                className={classNames({disabled: pathNum >= allPathCount})}
            >&gt;</button>
        </div>
        <div className="trace-path__detail">
            <Scrollbar 
                noScrollX
                noScrollY={false}
            >
                {
                    tracePathNodes 
                        ? <PathNodes 
                            isSourceCodeView={isSourceCodeView}
                            pathIndex={pathIndex}
                            tracePathNodes={tracePathNodes} 
                            onSelectedNode={onSelectedNode} 
                        /> 
                        : <p className="tips">{i18n.t('issueDetail.trace-path-operation-tip')}</p>
                }
            </Scrollbar>
        </div>
    </div>
}

const PathNodes = props => {
    const {
        isSourceCodeView,
        pathIndex,
        tracePathNodes,
        onSelectedNode
    } = props;

    const [isShowTip, setIsShowTip] = useState(false);
    // source and sink are selected by default
    const defaultSelected = isSourceCodeView ? [0, tracePathNodes.length - 1] : [null, null];
    const [selectedNodeIndexs, setSelectedNodeIndexs] = useState(defaultSelected);

    const handleHideTip = () => {
        setIsShowTip(false);
    }

    const handleSelectedNode = index => {
        if(!onSelectedNode) return;

        let sltNodeIndex1 = selectedNodeIndexs[0];
        let sltNodeIndex2 = selectedNodeIndexs[1];

        if(!utils.isEmpty(sltNodeIndex1) && !utils.isEmpty(sltNodeIndex2) && !selectedNodeIndexs.includes(index)) {
            setIsShowTip(true);
            return;
        }

        // deselect
        if(sltNodeIndex1 === index) {
            sltNodeIndex1 = null;
        } 
        else if(sltNodeIndex2 === index) {
            sltNodeIndex2 = null;
        }
        // select
        else if(utils.isEmpty(sltNodeIndex1)) {
            sltNodeIndex1 = index;
        } 
        else if(utils.isEmpty(sltNodeIndex2)) {
            sltNodeIndex2 = index;
        } 

        const sltNodeIndexs = [sltNodeIndex1, sltNodeIndex2];
        setSelectedNodeIndexs(sltNodeIndexs);
        onSelectedNode(sltNodeIndexs, pathIndex);
    }

    const isSelectCompleted = !utils.isEmpty(selectedNodeIndexs[0]) && !utils.isEmpty(selectedNodeIndexs[1]);

    return <div className="nodes-wrap">
        <ul className="nodes">
            {
                tracePathNodes.map((data, index) => 
                    <PathNode 
                        key={index} 
                        index={index}
                        data={data} 
                        isSink={index === (tracePathNodes.length - 1)}
                        isSelected={selectedNodeIndexs.includes(index)}
                        isDisable={isSelectCompleted && !selectedNodeIndexs.includes(index)}
                        handleSelectedNode={handleSelectedNode} 
                    />
                )
            }
        </ul>
        {
            isShowTip &&
            <TipMessage 
                autoHide 
                onHide={handleHideTip}
                message={i18n.t('issueDetail.trace-path-click-node-tip')}
            />
        }
    </div>
}

const PathNode = props => {
    const {
        index,
        data,
        isSink,
        isSelected,
        isDisable,
        handleSelectedNode
     } = props;
    return <li className={classNames({selected: isSelected, disable: isDisable})} onClick={() => handleSelectedNode(index)}>
        {
            index === 0 &&
            <div className="source-sink-tag">
                {i18n.t('issueDetail.source')}
            </div>
        }
        {
            isSink && 
            <div className="source-sink-tag">
                {i18n.t('issueDetail.sink')}
            </div>
        }
        <div className="index">{data.seq}</div>
        <div className="line-num">{i18n.t('issueDetail.line')} {data.lineNo}</div>
        <div className="file-info">
            <p>{data.message}</p>
            <p>{data.file}</p>
        </div>
    </li>;
}

export default TracePath;