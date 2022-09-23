import React, {useRef, useState} from "react";
import classNames from "classnames";
import * as utils from 'Utils';
import Tooltips from "./Tooltips/Tooltips";
import Arrows from "./Arrows";
import ResizableAceEditor from "./ResizableAceEditor/ResizableAceEditor";

import {getArrowsCords, getTracePathMarkers, getLineColors, getArrowColors} from "./functions";
import {SOURCE_CODE_LINE_HEIGHT, TOOLTIP_COLORS} from "./constants";

import './RealSourceCode.scss';

const RealSourceCode = ({fileData, initialHeight, arrowsEnabled = true, className, selectedLineNo, only15LinesLoaded}) => {
    const svgArrows = useRef(null);
    const codeTooltips = useRef(null);

    const totalLinesAmount = only15LinesLoaded ? 15 : fileData.sourceCode.split('\n').length;
    const scrolledContentHeight = SOURCE_CODE_LINE_HEIGHT * totalLinesAmount + 'px';

    const arrowsCords = getArrowsCords(fileData.arrows, SOURCE_CODE_LINE_HEIGHT);

    const tracePathMarkers = getTracePathMarkers(fileData.lines, only15LinesLoaded);

    const focusedLine = !utils.isEmpty(selectedLineNo) ? selectedLineNo : fileData.lines[0].lineNo;

    // scroll arrows and tooltips together with source code
    const onAceScroll = newScrollTop => {
        svgArrows.current.scrollTop = newScrollTop;
        codeTooltips.current.scrollTop = newScrollTop;
    };

    const lineColors = getLineColors(fileData.lines, TOOLTIP_COLORS);

    const arrowColors = getArrowColors(fileData.arrows, lineColors);

    const [height, setHeight] = useState(initialHeight);

    const classes = classNames("ace-arrows", {
        [className]: className
    });

    let style;

    if (height) {
        style = {height: height + 'px'}
    }

    return (
        <div className={classes} style={style}>
            <div ref={svgArrows} className="scrolled-content-wrapper">
                {
                    arrowsEnabled &&
                    <Arrows height={scrolledContentHeight} arrowsCords={arrowsCords} arrowColors={arrowColors}/>
                }
            </div>

            <ResizableAceEditor
                height={height}
                heightChanged={setHeight}
                tracePathMarkers={tracePathMarkers}
                sourceCode={fileData.sourceCode}
                filePath={fileData.file}
                focusedLine={focusedLine}
                onAceScroll={onAceScroll}
                only15LinesLoaded={only15LinesLoaded}
            />

            <div ref={codeTooltips} className="scrolled-content-wrapper code-tooltips">
                <Tooltips
                    height={scrolledContentHeight}
                    lines={fileData.lines}
                    lineHeight={SOURCE_CODE_LINE_HEIGHT}
                    lineColors={lineColors}
                    only15LinesLoaded={only15LinesLoaded}
                />
            </div>
        </div>
    );
};

export default RealSourceCode;