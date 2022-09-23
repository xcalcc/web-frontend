import {GRAPH_MINIMAL_NODES_DISTANCE, GRAPH_EDGES_DASHES} from "./constants";
import vis from "vis-network";

export class NodesAndEdgesGenerator {

    generate = (executionPathsData, isMultipleSink) => {
        // array of nodes sets
        // node set is array of nodes for certain execution path
        const nodesSets = [];

        const sourcePathItem = executionPathsData[0].tracePath[0];
        const sourceNode = this._createNode(sourcePathItem, 'source');

        const sinkPathItem = executionPathsData[0].tracePath[executionPathsData[0].tracePath.length - 1];

        // for multiple sink, duplicate sink node drawn, but last one won't display
        const sinkNode = this._createNode(sinkPathItem, 'sink', null, isMultipleSink);

        executionPathsData.forEach((executionPathData, pathIndex) => {
            const executionPathNodesSet = [];
            const executionPathItems = executionPathData.tracePath;
            let edgeNodesCount = 0;

            // skip source
            // skip sink only when it is single sink
            const pathItemLength = isMultipleSink ? executionPathItems.length : executionPathItems.length - 1;
            for (let itemSerialNumber = 1; itemSerialNumber < pathItemLength; itemSerialNumber++) {
                const pathItem = executionPathItems[itemSerialNumber];

                executionPathNodesSet.push(this._createNode(pathItem, pathIndex, itemSerialNumber));
                edgeNodesCount++;
            }

            if (edgeNodesCount === 0) {
                for (let itemSerialNumber = 0; itemSerialNumber < (executionPathItems.length); itemSerialNumber++) {
                    const pathItem = executionPathItems[itemSerialNumber];

                    executionPathNodesSet.push(this._createNode(pathItem, pathIndex, itemSerialNumber, true));
                }
            }

            nodesSets.push(executionPathNodesSet);
        });

        this._setNodesCoordinates(nodesSets, sourceNode, sinkNode);

        const nodes = nodesSets.flat();
        nodes.push(sourceNode, sinkNode);

        const edgesSets = this._generateEdgesSets(nodesSets, isMultipleSink);

        const edges = edgesSets.flat();

        return {
            nodesSets,
            edgesSets,
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges),
        }
    };


    _generateEdgesSets = (nodesSets, isMultipleSink) => (
        nodesSets.map((setOfNodes, pathIndex) => {
            const setOfEdges = [];

            if (setOfNodes.length === 0) {
                const theOnlyEdge = this._createEdge(pathIndex, 'source', 'sink');

                setOfEdges.push(theOnlyEdge);

                return setOfEdges;
            }

            const firstNode = setOfNodes[0];
            const lastNode = setOfNodes[setOfNodes.length - 1];

            let previousNode;

            setOfNodes.forEach(node => {
                if (previousNode) {
                    const newEdge = this._createEdge(pathIndex, previousNode.id, node.id);

                    setOfEdges.push(newEdge);
                }

                previousNode = node;
            });

            const fromSourceEdge = this._createEdge(pathIndex, 'source', firstNode.id);
            setOfEdges.push(fromSourceEdge);


            if (!isMultipleSink) {
                const toSinkEdge = this._createEdge(pathIndex, lastNode.id, 'sink');
                setOfEdges.push(toSinkEdge);
            }

            return setOfEdges;
        })
    );


    _setNodesCoordinates = (nodesSets, sourceNode, sinkNode) => {
        // algorithm to evenly spread nodes on graph
        // (0;0) point is in the center of graph (not top left corner)
        const longestPathLength = this._getLongestArrayLength(nodesSets);

        const xSegmentsTotalAmount = nodesSets.length - 1;
        // 2 additional nodes (source and sink)
        const ySegmentsTotalAmount = longestPathLength + 1;

        let virtualWidth;
        let virtualHeight;
        const sourceAndSinkDistanceCoefficient = 0.3;

        virtualWidth = xSegmentsTotalAmount * GRAPH_MINIMAL_NODES_DISTANCE;
        virtualHeight = ySegmentsTotalAmount * GRAPH_MINIMAL_NODES_DISTANCE;

        if (virtualWidth > virtualHeight) {
            virtualHeight = virtualWidth;
            virtualHeight = virtualHeight + virtualHeight * sourceAndSinkDistanceCoefficient;
            virtualWidth = virtualHeight;
        } else {
            virtualHeight = virtualHeight + virtualHeight * sourceAndSinkDistanceCoefficient;
            virtualWidth = virtualHeight;
        }

        virtualWidth = virtualWidth * 2;

        const xStartingPoint = -virtualWidth / 2;
        const yStartingPoint = -virtualHeight / 2;

        const xNodesDistance = virtualWidth / xSegmentsTotalAmount || 0;

        nodesSets.forEach((setOfNodes, xShiftFactor) => {
            const ySegmentsAmountInSet = (setOfNodes.length - 1) + 2;
            const yNodesDistance = virtualHeight / ySegmentsAmountInSet;

            const xDistanceFromStartingPoint = xShiftFactor * xNodesDistance;
            // x cord is same for all nodes in set
            let setX_Cord = xStartingPoint + xDistanceFromStartingPoint;

            if(xSegmentsTotalAmount === 0) {
                setX_Cord = 0;
            }

            setOfNodes.forEach((node, nodeInPathSerialNumber) => {
                node.x = setX_Cord;

                // add 1 to nodeInPathSerialNumber because source node is NOT included in setOfNodes
                // so should add it manually
                const yShiftFactor = nodeInPathSerialNumber + 1;
                const yDistanceFromStartingPoint = yShiftFactor * yNodesDistance;
                node.y = yStartingPoint + yDistanceFromStartingPoint;
            });
        });

        sourceNode.x = 0;
        // the topmost node
        sourceNode.y = yStartingPoint - virtualHeight * (sourceAndSinkDistanceCoefficient / 2);

        sinkNode.x = 0;
        // the bottommost node
        sinkNode.y = virtualHeight / 2 + virtualHeight * (sourceAndSinkDistanceCoefficient / 2);
    };


    _createNode = (pathItem, pathIndexOrNodeId, itemSerialNumber = null, hideNode = false) => {
        let id, pathIndex;


        if (typeof pathIndexOrNodeId === 'number') {
            id = pathIndexOrNodeId + '__' + itemSerialNumber;
            pathIndex = pathIndexOrNodeId;
            if (hideNode) {
                pathIndex = 'hidden';
            }
        }
        else {
            id = pathIndexOrNodeId;
            pathIndex = null;
        }

        let node = {
            id,
            pathItem,
            pathIndex
        };

        if (hideNode) {
            node.size = 0;
        }

        return node;
    };


    _createEdge = (pathIndex, fromId, toId) => (
        {
            id: `${pathIndex}--${fromId}--${toId}`,
            from: fromId,
            to: toId,
            dashes: GRAPH_EDGES_DASHES,
        }
    );


    _getLongestArrayLength = arrayOfArrays => {
        let longestArrayLength = -Infinity;

        arrayOfArrays.forEach(a => {
            if (a.length > longestArrayLength) {
                longestArrayLength = a.length;
            }
        });

        return longestArrayLength;
    };
}