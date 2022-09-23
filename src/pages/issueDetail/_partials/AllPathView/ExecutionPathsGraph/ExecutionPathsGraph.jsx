import React, {useEffect, useState, useRef} from 'react';

import 'vis-network/styles/vis-network.min.css';

import './ExecutionPathsGraph.css';
import SourceAndSinkOverlay from "./SourceAndSinkOverlay/SourceAndSinkOverlay";
import GraphNetwork from "./GraphNetwork";

const ExecutionPathGraph = props => {
    const {
        isMultipleSink,
        selectedPathIndex,
        executionPathsData,
        setHoveredPathIndex,
        onGraphExecutionPathClick,
        setNodeOrEdgeHovered
    } = props;

    const [network, setNetwork] = useState();
    const [graphLoaded, setGraphLoaded] = useState(false);
    const [graphIsZooming, setGraphIsZooming] = useState(false);
    const [graphIsDragging, setGraphIsDragging] = useState(false);
    const [hoverStatus, setHoverStatus] = useState(null);
    const [canZoomOut, setCanZoomOut] = useState(false);
    const [lastSelectedPathIndex, setLastSelectedPathIndex] = useState();

    const graphCanvas = useRef(null);

    const getHoverSinkInfoData = (hoveredPathIndex) => {
        if(isMultipleSink && !!executionPathsData[hoveredPathIndex]) {
            const issueTracePathNodes = executionPathsData[hoveredPathIndex].tracePath;
            return issueTracePathNodes[issueTracePathNodes.length-1];
        }
        return null;
    };

    const hoverHandle = status => {
        const hoveredPathIndex = _getHoveredPathIndex(status);

        setHoverStatus(status);
        setHoveredPathIndex(hoveredPathIndex === null ? -1 : hoveredPathIndex);
    };

    const zoom = shouldZoomIn => {
        if (shouldZoomIn) {
            network.zoomIn();

            setGraphIsZooming(true);
            setCanZoomOut(true);
        } else {
            const canZoomOut = network.zoomOut();

            setGraphIsZooming(true);
            setCanZoomOut(canZoomOut);
        }
    };

    const _getHoveredPathIndex = hoverStatus => {
        if (!hoverStatus) {
            return null;
        }

        if (hoverStatus.path !== undefined) {
            return hoverStatus.path;
        } else if (typeof hoverStatus.node === 'object' && hoverStatus.node !== null) {
            return hoverStatus.node.pathIndex;
        }

        return null;
    };

    const _canShowGraphOverlays = () => {
        const graphIsMoving = graphIsZooming || graphIsDragging;
        return graphLoaded && !graphIsMoving;
    }

    const hoveredPathIndex = _getHoveredPathIndex(hoverStatus);

    useEffect(() => {
        const network = new GraphNetwork(
            executionPathsData,
            graphCanvas.current,
            onGraphExecutionPathClick,
            hoverHandle,
            isMultipleSink,
            setNodeOrEdgeHovered,
        );

        network.onDragStart(() => setGraphIsDragging(true));
        network.onDragEnd(() => setGraphIsDragging(false));

        network.onZoomEnd(() => setGraphIsZooming(false));

        setGraphLoaded(true);
        setNetwork(network);
    }, [executionPathsData]);

    useEffect(() => {
        if(!network) return;

        if(parseInt(lastSelectedPathIndex) >= 0) {
            network.unhighlightPath(lastSelectedPathIndex);
        }

        if(parseInt(selectedPathIndex) >= 0) {
            network.highlightPath(selectedPathIndex);
            setLastSelectedPathIndex(selectedPathIndex);
        }
    }, [selectedPathIndex]);

    return (
        <div className="graph">
            <div className="graph__container">
                <div ref={graphCanvas} className="graph__canvas"/>

                <div className="graph__zoom">
                    <button
                        className="graph__zoom-button zoom-in"
                        onClick={() => zoom(true)}
                    />
                    <div className="graph__zoom-divider"/>
                    <button
                        className="graph__zoom-button zoom-out"
                        disabled={!canZoomOut}
                        onClick={() => zoom(false)}
                    />
                </div>

                <SourceAndSinkOverlay
                    isMultipleSink={isMultipleSink}
                    visible={_canShowGraphOverlays()}
                    sourceNode={graphLoaded ? network.getNodeWithCordsByID('source') : null}
                    sinkNode={graphLoaded ? network.getNodeWithCordsByID('sink') : null}
                    sinkInfoData={getHoverSinkInfoData(hoveredPathIndex)}
                />
            </div>
        </div>
    );
}

export default ExecutionPathGraph;