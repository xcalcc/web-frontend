import React from 'react';
import PropTypes from "prop-types";
import {XInput} from 'Components/Form';
import './style.scss';

const InputWithEdit = props => {
    return (
        <div className="input-with-edit">
            <XInput {...props} />
        </div>
    )
}

InputWithEdit.defaultProps = {
    className: 'as-label'
}
InputWithEdit.propTypes = {
    className: PropTypes.string
}

export default InputWithEdit;