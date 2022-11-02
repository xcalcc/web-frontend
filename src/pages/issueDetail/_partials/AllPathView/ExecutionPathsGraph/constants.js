export const GRAPH_MINIMAL_NODES_DISTANCE = 100;

export const GRAPH_SCALE_STEP = 1.7;

export const GRAPH_EDGES_DASHES = [28, 20];

export const EDGE_NORMAL_COLOR = '#636466';
export const NODE_NORMAL_COLOR = '#231f20';
export const HIGHLIGHT_COLOR = '#ed1c24';

export const GRAPH_DEFAULT_OPTIONS = {
  nodes: {
    shape: 'dot',
    size: 38,
    borderWidth: 0,
    color: NODE_NORMAL_COLOR,
    font: {
      color: '#fff',
      size: 22,
    },
    shadow: true,
    chosen: false,
    fixed: true
  },
  edges: {
    arrows: {
      to: false,
    },
    color: EDGE_NORMAL_COLOR,
    width: 10,
    hoverWidth: 0
  },
  layout: {
    randomSeed: 0
  },
  interaction: {
    dragNodes: false,
    dragView: false,
    selectable: true,
    selectConnectedEdges: false,
    hover: true,
    hoverConnectedEdges: false,
    zoomView: false,
  },
  physics: false
};