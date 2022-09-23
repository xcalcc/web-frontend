import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Spinner} from 'react-bootstrap';
import './style.scss';

const TipMessage = props => {

    const [isHide, setIsHide] = useState(false);

    useEffect(() => {
        if(props.autoHide) {
            setTimeout(() => {
                setIsHide(true);
                props.onHide && props.onHide();
            }, props.delay);
        }
    }, []);

    if(isHide) return null;

    return <div className="tip-message">
        {
            props.isShowLoading && 
            <div className="tip-message__icon">
                <Spinner animation="border" variant="light" />
            </div>
        }
        <span className="tip-message__content">{props.message}</span>
    </div>
}

TipMessage.propTypes = {
    onHide: PropTypes.func,
    showLoading: PropTypes.bool,
    autoHide: PropTypes.bool,
    delay: PropTypes.number,
    message: PropTypes.string
}
TipMessage.defaultProps = {
    showLoading: false,
    autoHide: false,
    delay: 3000
}

export default TipMessage;