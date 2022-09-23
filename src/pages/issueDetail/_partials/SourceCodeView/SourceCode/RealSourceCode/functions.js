export const getArrowsCords = (arrows, lineHeight) => arrows.map(({from, to}) => {
  const shiftFromCenter = from > to ? -3 : 3;
  // const controlPointShift = Math.round((from - to) * lineHeight / 38);
  const startingLineCenterCord = getLineCenterCord(from, lineHeight);
  const startingPointYCord = startingLineCenterCord + shiftFromCenter;

  let path = 'M25 ' + startingPointYCord + ' C '; // starting point
  path += '0 ' + startingPointYCord + ', '; // first control point

  const finishLineCenterCord = getLineCenterCord(to, lineHeight);
  const finishPointYCord = finishLineCenterCord - shiftFromCenter;

  path += '0 ' + finishPointYCord + ', '; // second control point
  path += '20 ' + finishPointYCord; // finish point

  return path;
});

export const getTracePathMarkers = (lines, only15LinesLoaded) => {
    return lines.map(({lineNo}) => {
        let lineNoFrom0 = lineNo - 1;

        if (only15LinesLoaded) {
            lineNoFrom0 = lineNoFrom0 > 7 ? 7 : lineNoFrom0;
        }

        return {
            startRow: lineNoFrom0,
            endRow: lineNoFrom0,
            startCol: 0,
            endCol: 1,
            className: 'gray_marker',
            type: 'fullLine',
        }
    });
};

export const getLineColors = (lines, colors) => {
    let lineColors = [];
    lines.forEach((item, i) => {
        if (lineColors[item.lineNo] === undefined) {
            let len = lineColors.filter(x=>!!x).length;
            let color = colors[len % colors.length];
            lineColors[item.lineNo] = color;
        }
    });
    return lineColors;
};

export const getArrowColors = (arrows, lineColors) => {
    let arrowColors = [];

    arrows.forEach((item, i) => {
        arrowColors[i] = lineColors[item.from + 1];
    });
    return arrowColors;
};

const getLineCenterCord = (lineNo, lineHeight) => lineNo * lineHeight + lineHeight / 2;