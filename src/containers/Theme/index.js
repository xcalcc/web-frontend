import React, {useState, useMemo} from "react";
import {useDispatch} from "react-redux";
import * as actions from 'Actions';
import {useHistory} from "react-router-dom";
import classnames from "classnames";
import Header from 'Components/Header';
import SideBar from 'Components/SideBar';
import {ChevronLeft} from "react-bootstrap-icons";

import './style.scss';

const BasicTheme = props => {
    const dispatch = useDispatch();
    const history = useHistory();

    if (!props.header && !props.sidebar) {
        return <div className="full-cover">{props.children}</div>
    }

    const [isHide, setIsHide] = useState(false);

    useMemo(() => {
        dispatch(actions.pushUrl(history.location.pathname));
    }, [history.location.pathname]);

    return <div className="theme-basic">
        {
            props.header &&
            <div className="theme-basic-header">
                <Header/>
            </div>
        }
        <div className="theme-basic-main">
            {
                props.sidebar &&
                <div className={classnames("theme-basic-sidebar", {hide: isHide})}>
                    <SideBar />
                    <button 
                        className="sidebar-toggle"
                        onClick={() => setIsHide(!isHide)}
                    >
                        <ChevronLeft className="sidebar-toggle-icon" />
                    </button>
                </div>
            }
            <div className={classnames("theme-basic-content", {'sidebar-hidden': isHide})}>
                {props.children}
            </div>
        </div>
    </div>
}

export default BasicTheme;