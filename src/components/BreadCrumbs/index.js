import React,{Fragment} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {NavLink, withRouter} from "react-router-dom";

import './style.scss';

const BreadCrumbs = props => {
    if(!props.data || props.data.length === 0) {
        return null;
    }

    return (
        <div className="breadcrumbs">
            {
                props.data.map((item, index) => {
                    return <Fragment key={index}>
                        {
                            item.path
                                ? <NavLink 
                                    to={item.path}
                                    className={classNames({current: item.current})}
                                  >
                                    {item.title}
                                  </NavLink>
                                : <span className={classNames({current: item.current})}>
                                    {item.title}
                                  </span>
                        }
                        {index > 0 && index < props.data.length-1 && <i>/</i>}
                    </Fragment>
                })
            }
        </div>
    );
}

BreadCrumbs.propTypes = {
    data: PropTypes.array,
}
BreadCrumbs.defaultProps = {
    data: [],
}

export default withRouter(BreadCrumbs);
