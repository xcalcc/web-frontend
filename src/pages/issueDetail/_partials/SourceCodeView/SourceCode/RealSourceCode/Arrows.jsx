import React, {useMemo} from "react";

const Arrows = ({height, arrowsCords, arrowColors}) => {
    const randomId = useMemo(() => Math.random().toString());

    return (
        <svg className="svg-arrows" height={height}>
            <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto"
                    markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#F98323"/>
            </marker>
            {
                arrowColors.map((color, i) =>
                    <marker key={color + i} id={`arrow-${randomId}-${color}`} markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto"
                            markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill={color}/>
                    </marker>
                )
            }
            </defs>
            {
                arrowsCords.map((cords, i) =>
                    <path d={cords}
                        key={i}
                        stroke={arrowColors[i] ? arrowColors[i] :"#F98323"}
                        strokeWidth="1"
                        fill="transparent"
                        markerEnd={arrowColors[i] ? `url(#arrow-${randomId}-${arrowColors[i]})` : "url(#arrow)"}/>
                )
            }
        </svg>
    )
};

export default Arrows;