import vis from "vis-network";

import {
    EDGE_NORMAL_COLOR,
    GRAPH_DEFAULT_OPTIONS,
    GRAPH_SCALE_STEP,
    GRAPH_EDGES_DASHES,
    HIGHLIGHT_COLOR,
    NODE_NORMAL_COLOR
} from "./constants";
import {NodesAndEdgesGenerator} from "./NodesAndEdgesGenerator";

class GraphNetwork {
    _hoveredNode = null;
    _hoveredPathIndex = null;

    constructor(executionPaths, graphContainer, executionPathClickHandler, hoverHandler, isMultipleSink, setNodeOrEdgeHovered) {
        this.graphContainer = graphContainer;

        const nodesAndEdges = new NodesAndEdgesGenerator();
        const {nodes, edges, nodesSets, edgesSets} = nodesAndEdges.generate(executionPaths, isMultipleSink);

        this.setNodeOrEdgeHovered = setNodeOrEdgeHovered;

        this.nodesSets = nodesSets;
        this.edgesSets = edgesSets;

        const options = GRAPH_DEFAULT_OPTIONS;

        this.nodes = nodes;
        this.edges = edges;

        this.sourceNode = this.nodes.get('source');
        this.sinkNode = this.nodes.get('sink');

        const data = {
            nodes: this.nodes,
            edges: this.edges
        };

        this.network = new vis.Network(graphContainer, data, options);

        this._graphCurrentScale = this.network.getScale();

        this._scaleToFit();

        this._alignGraphToTop();

        this._registerNetworkEvents(executionPathClickHandler, hoverHandler);
    }


    onDragStart = handler => {
        this.network.on('dragStart', handler);
    };


    onDragEnd = handler => {
        this.network.on('dragEnd', handler);
    };

    onZoomEnd = handler => {
        this.network.on('animationFinished', handler);
    };


    getHighlightedNodesWithCoords = () => {
        let highlightedNodes = [];

        if (this._hoveredPathIndex !== null) {
            this.nodesSets[this._hoveredPathIndex].forEach(node => {
                if (node.pathIndex !== 'hidden') {
                    highlightedNodes.push(node);
                }
            });

        } else if (this._hoveredNode !== null) {
            highlightedNodes = [this._hoveredNode];
        }

        return highlightedNodes.map(node => (
            {
                ...node,
                ...this._getNodeDOM_Positions(node)
            }
        ));
    };


    zoomIn = () => {
        const newScale = this._graphCurrentScale * GRAPH_SCALE_STEP;

        this._scale(newScale);
    };


    zoomOut = () => {
        const newScale = this._graphCurrentScale / GRAPH_SCALE_STEP;

        if (newScale > this._graphMinimalScale) {
            this._scale(newScale);

            return true;
        } else {
            this._scale(this._graphMinimalScale);

            return false;
        }
    };


    getNodeWithCordsByID = nodeId => {
        const node = this.nodes.get(nodeId);

        return {
            ...node,
            ...this._getNodeDOM_Positions(node)
        }
    };

    areSourceOrSinKNodesVisible = () => {
        const isSourceNodeVisible = this._isNodeVisible(this.sourceNode);
        const isSinkNodeVisible = this._isNodeVisible(this.sinkNode);

        return isSourceNodeVisible || isSinkNodeVisible;
    };


    _registerNetworkEvents = (executionPathClickHandler, hoverHandler) => {
        this.network.on('click', properties => {});

        this.network.on('selectNode', properties => {
            let selectedPathIndex;
            const nodeId = properties.nodes[0];
            if(this.nodesSets.length > 1 && (nodeId === 'source' || nodeId === 'sink')) {
                return;
            }

            if (this.nodesSets.length === 1) {
                selectedPathIndex = 0;
            } 
            else {
                selectedPathIndex = this._getNodePathIndexById(nodeId);
            }

            executionPathClickHandler(selectedPathIndex);
        });

        this.network.on('selectEdge', properties => {
            const edgeId = properties.edges[0];
            const selectedPathIndex = this._getEdgePathIndexById(edgeId);

            this.setNodeOrEdgeHovered(false);

            if (this._hoveredPathIndex !== null) {
                this.unhighlightPath(this._hoveredPathIndex);
                this._hoveredPathIndex = null;
            }
            else if (this._hoveredNode !== null) {
                this._hoveredNode.color = NODE_NORMAL_COLOR;
                this.nodes.update(this._hoveredNode);
                this._hoveredNode = null;
            }
            hoverHandler(null);

            executionPathClickHandler(selectedPathIndex);
        });

        this.network.on('hoverNode', properties => {
            this.setNodeOrEdgeHovered(true);

            const hoveredNodeId = properties.node;

            if(this.nodesSets.length > 1 && (hoveredNodeId === 'source' || hoveredNodeId === 'sink')) {
                return;
            }

            const hoveredNode = this.nodes.get(hoveredNodeId);
            if(!hoveredNode) return;

            const pathIndex = this.nodesSets.length === 1 ? 0 : hoveredNode.pathIndex;

            hoveredNode.color = HIGHLIGHT_COLOR;
            this.highlightPath(pathIndex);
            this.nodes.update(hoveredNode);

            this._hoveredNode = hoveredNode;

            hoverHandler({node: this._hoveredNode});
        });

        this.network.on('blurNode', properties => {
            if (!this._hoveredNode) {
                return;
            }
            this.setNodeOrEdgeHovered(false);

            const hoveredNodeId = properties.node;

            if(this.nodesSets.length > 1 && (hoveredNodeId === 'source' || hoveredNodeId === 'sink')) {
                return;
            }

            const pathIndex = this.nodesSets.length === 1 ? 0 : this._hoveredNode.pathIndex;

            this._hoveredNode.color = NODE_NORMAL_COLOR;
            this.unhighlightPath(pathIndex);
            this.nodes.update(this._hoveredNode);
            this._hoveredNode = null;

            hoverHandler(null);
        });

        this.network.on('hoverEdge', properties => {
            this.setNodeOrEdgeHovered(true);

            const edgeId = properties.edge;
            const hoveredPathIndex = this._getEdgePathIndexById(edgeId);

            this.highlightPath(hoveredPathIndex);
            this._hoveredPathIndex = hoveredPathIndex;

            hoverHandler({path: this._hoveredPathIndex});
        });

        this.network.on('blurEdge', () => {
            if (this._hoveredPathIndex === null) {
                return;
            }
            this.setNodeOrEdgeHovered(false);

            this.unhighlightPath(this._hoveredPathIndex);
            this._hoveredPathIndex = null;

            hoverHandler(null);
        });
    };


    _scale = (scaleFactor, animate = true) => {
        this._graphCurrentScale = scaleFactor;

        const animation = animate ? {duration: 300} : false;

        this.network.moveTo({
            scale: this._graphCurrentScale,
            animation: animation
        });
    };


    highlightPath = pathIndex => {
        // update nodes
        const nodesSet = this.nodesSets[pathIndex];
        if(!nodesSet) return;

        nodesSet.forEach(node => node.color = HIGHLIGHT_COLOR);

        this.sourceNode.color = HIGHLIGHT_COLOR;
        this.sinkNode.color = HIGHLIGHT_COLOR;

        const updatedNodes = [...nodesSet, this.sourceNode, this.sinkNode];

        this.nodes.update(updatedNodes);

        // update edges
        const edgesSet = this.edgesSets[pathIndex];

        edgesSet.forEach(edge => {
            edge.color = HIGHLIGHT_COLOR;
            edge.dashes = false;
        });

        this.edges.update(edgesSet);
    };


    unhighlightPath = pathIndex => {
        // update nodes
        const nodesSet = this.nodesSets[pathIndex];
        if(!nodesSet) return;

        nodesSet.forEach(node => node.color = NODE_NORMAL_COLOR);

        this.sourceNode.color = NODE_NORMAL_COLOR;
        this.sinkNode.color = NODE_NORMAL_COLOR;

        const updatedNodes = [...nodesSet, this.sourceNode, this.sinkNode];

        this.nodes.update(updatedNodes);

        // update edges
        const edgesSet = this.edgesSets[pathIndex];

        edgesSet.forEach(edge => {
            edge.color = EDGE_NORMAL_COLOR;
            edge.dashes = GRAPH_EDGES_DASHES;
        });

        this.edges.update(edgesSet);
    };


    _getEdgePathIndexById = (edgeId) => {
        return parseInt(edgeId.split('--')[0]);
    };


    _getNodePathIndexById = (nodeId) => {
        return parseInt(nodeId.split('__')[0]);
    };


    _getNodeDOM_Positions = node => {
        const positions = this.network.getPositions(node.id)[node.id];
        const {x, y} = this.network.canvasToDOM(positions);

        return {
            DOM_X: x,
            DOM_Y: y
        };
    };


    _scaleToFit = () => {
        // empirical way to fit graph with source-and-sink overlay in canvas space initially
        this._graphMinimalScale = this._graphCurrentScale - this._graphCurrentScale / 4;

        this._scale(this._graphMinimalScale, false);
    };


    _alignGraphToTop = () => {
        const {DOM_Y} = this._getNodeDOM_Positions(this.sourceNode);

        this.network.moveTo({offset: {x: 0, y: (-DOM_Y + 85)}});
    };


    _isNodeVisible = node => {
        const {DOM_X: nodeX, DOM_Y: nodeY} = this._getNodeDOM_Positions(node);

        if (nodeX < 0 || nodeY < 0) {
            return false;
        }

        const graphWidth = this.graphContainer.offsetWidth;
        const graphHeight = this.graphContainer.offsetHeight;

        return nodeX < graphWidth && nodeY < graphHeight;
    };
}

export default GraphNetwork;