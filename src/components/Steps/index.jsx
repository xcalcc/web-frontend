import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';

const Steps = props => {
    const {
        totalSteps,
        current
    } = props;

    return (
        <div className="steps">
            <div className="steps__progress">
                <ul>
                    {
                        Array.from(Array(totalSteps)).map((x, index) => 
                            <li 
                                key={index} 
                                className={classNames({"steps__progress--active": (index+1) <= current})}
                            >
                                {index+1}
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    );
}

Steps.propTypes = {
    totalSteps: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired
}

export default Steps;