import React, {useEffect, useMemo, useRef, useState} from 'react';
import TooltipsContainer from "Components/TooltipsContainer_deprecated";

const Tooltip = ({shortTooltipTop, message, color='', multipleLine=false, multipleMessages=[]}) => {
    const shortTooltip = useRef(null);

    const [longTooltipCoordinates, setLongTooltipCoordinates] = useState(null);

    const onShortTooltipMouseOver = e => {
        const shortTooltipElement = shortTooltip.current;

        // if element has ellipsis
        if (shortTooltipElement.offsetWidth < shortTooltipElement.scrollWidth || multipleLine) {
            const {top, left} = e.target.getBoundingClientRect();

            setLongTooltipCoordinates({top, left});
        }
    };

    const hideLongTooltip = () => {
        setLongTooltipCoordinates(null);
    };

    // capture all element on first render
    // in order to give them event listener
    // which on mouseenter will delete long tooltip
    const capturedDomElements = useMemo(() => document.querySelectorAll('*'), []);

    const mouseenterHandler = () => {
        for (const element of capturedDomElements) {
            element.removeEventListener('mouseenter', mouseenterHandler);
        }
    };

    useEffect(() => {
        if (longTooltipCoordinates) {
            for (const element of capturedDomElements) {
                element.addEventListener('mouseenter', mouseenterHandler);
            }
        }
    }, [longTooltipCoordinates]);

    let longTooltip;

    if (longTooltipCoordinates) {
        longTooltip = (
            <TooltipsContainer>
                <div
                    style={{
                        top: longTooltipCoordinates.top,
                        left: longTooltipCoordinates.left
                    }}
                    onMouseOut={hideLongTooltip /*additional action to hide long tooltip when its needed*/}
                    className="code-tooltips__text code-tooltips__text--long"
                >
                    { multipleLine ?
                        multipleMessages.map((item, i) =>
                            <React.Fragment key={i}>
                                {item}
                                {(i < multipleMessages.length - 1) && <hr/>}
                            </React.Fragment>
                        ) : message
                    }
                </div>
            </TooltipsContainer>
        );
    }

    return (
        <>
            <div className="code-tooltips__item" style={{top: shortTooltipTop}}>
              <span className="code-tooltips__arrow-wrapper" style={{backgroundColor: color}}>
                {!multipleLine && <div className="code-tooltips__arrow"/>}
                {multipleLine && <div className="code-tooltips__double-arrow">
                    <div className="code-tooltips__arrow"/>
                    <div className="code-tooltips__arrow"/>
                </div>
                }
              </span>
                <div onMouseOver={onShortTooltipMouseOver}
                     ref={shortTooltip}
                     className="code-tooltips__text code-tooltips__text--short"
                >
                    {message}
                </div>
            </div>
            {longTooltip}
        </>
    );
};

export default Tooltip;