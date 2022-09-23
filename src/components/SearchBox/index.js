import React from "react";
import i18n from 'i18next';
import PropTypes from 'prop-types';
import {Search} from 'react-bootstrap-icons';
import CloseIcon from 'Icons/close.svg';

import './search-box.scss';

const SearchBox = props => {

    const handleChange = event => {
        props.onChange && props.onChange(event.target.value);
    }

    const handleKeyup = (event) => {
        if(event.keyCode === 13) {
            props.onSearch && props.onSearch(props.value);
        }
    }

    const handleFocus = (event) => {
        props.onFocus && props.onFocus(event);
    }

    return <div className="scanning-search">
        <input
            type="search"
            placeholder={props.placeHolder || i18n.t('pages.scan-result.search-box-placeholder')}
            value={props.value}
            onChange={handleChange}
            onKeyUp={handleKeyup}
            onFocus={handleFocus}
        />
        <button className="btn-search" onClick={() => props.onSearch && props.onSearch(props.value)}>
            <Search />
        </button>
        {
            props.value &&
            <button className="btn-clear" onClick={() => props.onClear && props.onClear()}>
                <img src={CloseIcon} />
            </button>
        }
    </div>
}

SearchBox.propTypes = {
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onFocus: PropTypes.func,
    onClear: PropTypes.func,
}

SearchBox.defaultProps = {
    onChange: () => {},
    onSearch: () => {},
    onFocus: () => {},
    onClear: () => {},
}

export default SearchBox;
