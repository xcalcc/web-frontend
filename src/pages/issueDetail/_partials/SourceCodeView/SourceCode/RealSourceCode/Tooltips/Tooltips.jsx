import React from "react";

import Tooltip from "./Tooltip";

const Tooltips = ({height, lineHeight, lines, lineColors, only15LinesLoaded = false}) => {
    let isExist = false;
    let sameLines = [];
    let tooltipDataList = [];

    lines.forEach(({seq, lineNo, message}) => {
        let lineNoFrom0 = lineNo - 1;

        if (only15LinesLoaded) {
            lineNoFrom0 = lineNoFrom0 > 7 ? 7 : lineNoFrom0;
        }

        const shortTooltipTop = lineNoFrom0 * lineHeight + 'px';

        isExist = tooltipDataList.find(tooltipData => tooltipData.lineNo === lineNo);

        if(!isExist){
            sameLines = lines.filter(line => line.lineNo === lineNo);

            tooltipDataList.push({
                lineNo,
                shortTooltipTop,
                lines: sameLines
            });
        }
    });

    return <div style={{height}}>
        {tooltipDataList.map(({shortTooltipTop, lines}, i) => {
            let multipleMessages = lines.map(line => `${line.seq}. ${line.message}`);
            let message = multipleMessages[0].toString();
            let color = lineColors[lines[0].lineNo];

            return (
                <Tooltip
                    key={shortTooltipTop + i}
                    shortTooltipTop={shortTooltipTop}
                    message={message}
                    multipleLine={lines.length > 1}
                    color={color}
                    multipleMessages={multipleMessages}
                />
            );
        })}
    </div>
};

export default Tooltips;
