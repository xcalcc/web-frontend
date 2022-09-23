import React from 'react';
import PropTypes from 'prop-types';
import {Image} from "react-bootstrap";
import loaderGif from 'Images/new-loader-text.gif';
import './loader.scss';

const Loader = props => {

    return <div className="loader-spinning">
        {
            props.type === 'overlay' && <div className="overlay" />
        }
        <Image src={loaderGif} />
    </div>;
}

Loader.propTypes = {
    type: PropTypes.oneOf(['page', 'overlay']),
}

Loader.defaultProps = {
    type: 'overlay',
}

export default Loader;
