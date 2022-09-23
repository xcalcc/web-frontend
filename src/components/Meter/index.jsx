import React, {useEffect, useRef} from 'react';
import $ from "jquery";
import meterImg from 'Assets/images/meter.svg';
import pointerImg from 'Assets/images/meter-value.svg';
import './style.scss';

require("../../js/jquery.keyframes");

const Meter = ({title, value, valueName, valueNameClass, rotateDirectly = false}) => {
    const pointerRef = useRef(null);

    useEffect(() => {
        animateRotate(value, pointerRef.current);
    }, [value]);

    return (
        <div className="meterbox">
            {
                title && <div className="meterbox__title" title={title}>{title}</div>
            }

            <div className="meterbox__meter position-relative">
                <img src={meterImg} className="img-fluid meterbox__meter-meterbg"/>

                <strong ref={pointerRef} className="meterbox__meter-pointer">
                    <img className={`${rotateDirectly && `perc${value}`}`} src={pointerImg}/>
                </strong>
            </div>

            {
                valueName && <h6 className={valueNameClass}>{valueName}</h6>
            }
        </div>
    );
};

function animateRotate(rotateValue, animateElement) {
    $(animateElement).animate(
        {deg: rotateValue},
        {
            duration: 1750,
            easing: "linear",
            step: function (now) {
                now = rotateValue;
                $(this).css("-webkit-transform", "rotate(" + now + "deg)");
            },
            complete: function () {
                play(rotateValue, animateElement);
            }
        }
    );
}

function play(rotateValue, animateElement) {
    let animationName = "rotate_arrow" + rotateValue;

    $(animateElement).resetKeyframe(function () {
        $(animateElement).playKeyframe({
            name: animationName,
            duration: "2s",
            iterationCount: 1
        });
    });

    var count = rotateValue;
    var count_2 = parseInt(count) + parseInt(6);
    var count_3 = parseInt(count) - parseInt(6);
    var count_4 = parseInt(count) + parseInt(3);
    var count_5 = parseInt(count) - parseInt(3);

    $.keyframe.define([
        {
            name: animationName,
            "0%": {
                transform: "rotate(" + count + "deg)",
                "-webkit-transform": "rotate(" + count + "deg)",
                "-moz-transform": "rotate(" + count + "deg)"
            },
            "20%": {
                transform: "rotate(" + count_2 + "deg)",
                "-webkit-transform": "rotate(" + count_2 + "deg)",
                "-moz-transform": "rotate(" + count_2 + "deg)"
            },
            "40%": {
                transform: "rotate(" + count_3 + "deg)",
                "-webkit-transform": "rotate(" + count_3 + "deg)",
                "-moz-transform": "rotate(" + count_3 + "deg)"
            },
            "60%": {
                transform: "rotate(" + count_4 + "deg)",
                "-webkit-transform": "rotate(" + count_4 + "deg)",
                "-moz-trasform": "rotate(" + count_4 + "deg)"
            },
            "80%": {
                transform: "rotate(" + count_5 + "deg)",
                "-webkit-transform": "rotate(" + count_5 + "deg)",
                "-moz-transform": "rotate(" + count_5 + "deg)"
            },
            "100%": {
                transform: "rotate(" + count + "deg)",
                "-webkit-transform": "rotate(" + count + "deg)",
                "-moz-transform": "rotate(" + count + "deg)"
            }
        }
    ]);
}

export default Meter;