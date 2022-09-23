import React from 'react';
import * as utils from 'Utils';
import './SourceAndSinkOverlay.scss';

const SourceAndSinkOverlay = ({visible, sourceNode, sinkNode, sinkInfoData=null, isMultipleSink = false}) => {
    if (!visible || !sourceNode || !sinkNode) {
        return null;
    }

    const overlayOffsetLeft = 0;
    const nodeHalfRadius = 12;

    const {DOM_X: sourceNodeX, DOM_Y: sourceNodeY} = sourceNode;

    const topLineWidth = sourceNodeX - overlayOffsetLeft - nodeHalfRadius + 'px';
    const topLineTop = sourceNodeY + 'px';

    const topContentOffset = -76;
    const topOverlayTop = sourceNodeY + topContentOffset + 'px';

    const {DOM_X: sinkNodeX, DOM_Y: sinkNodeY} = sinkNode;

    const bottomLineWidth = sinkNodeX - overlayOffsetLeft - nodeHalfRadius + 'px';
    const bottomLineTop = sinkNodeY + 'px';

    const bottomContentOffset = -28;
    const bottomOverlayTop = sinkNodeY - bottomContentOffset + 'px';

    const left = overlayOffsetLeft + 'px';

    const sinkInfoBlock = data => (<>
        <div className="graph__sns-overlay__node-info__labels">
            {utils.language("sink")}:
            <br/>
            {utils.language("line_number")}:
        </div>

        <div className="graph__sns-overlay__node-info__values">
            {data.file}
            <br/>
            {data.lineNo}
        </div>
    </>);

    const sinkBlock = isMultipleSink ?
        (<>
            {(!!sinkInfoData && sinkInfoBlock(sinkInfoData)) || <span className="graph__sns-overlay__node-header">{utils.language("multi-sink")}</span>}

        </>) : sinkInfoBlock(sinkNode.pathItem);

    return (
        <div className="graph__sns-overlay">
            <div className="graph__sns-overlay__line" style={{
                width: topLineWidth,
                left: left,
                top: topLineTop
            }}/>

            <div className="position-absolute" style={{
                top: topOverlayTop,
                left: left
            }}>
                <div className="graph__sns-overlay__node-info">
                    <div className="graph__sns-overlay__node-info__labels">
                        {utils.language("source")}:
                        <br/>
                        {utils.language("line_number")}:
                    </div>

                    <div className="graph__sns-overlay__node-info__values">
                        {sourceNode.pathItem.file}
                        <br/>
                        {sourceNode.pathItem.lineNo}
                    </div>
                </div>
            </div>

            <div className="graph__sns-overlay__line" style={{
                width: bottomLineWidth,
                left: left,
                top: bottomLineTop
            }}/>

            <div className="position-absolute" style={{
                top: bottomOverlayTop,
                left: left,
                width: bottomLineWidth,
            }}>
                <div className="graph__sns-overlay__node-info">
                    {
                        sinkBlock
                    }
                </div>
            </div>

        </div>
    );
};

export default SourceAndSinkOverlay;