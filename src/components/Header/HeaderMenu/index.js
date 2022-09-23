import React from 'react';
import { useDispatch } from 'react-redux';
import * as actions from 'Actions';
import {useHistory} from 'react-router-dom';
import {Dropdown} from "react-bootstrap";
import {PersonCircle, QuestionCircle} from "react-bootstrap-icons";
import i18n from 'i18next';
import * as utils from "Utils";

import LogoutIcon from 'Icons/logout.svg';
import './style.scss';

const HeaderMenu = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const menus = [
        {
            label: i18n.t('user.profile'),
            icon: <PersonCircle />,
            url: '/profile'
        },
        {
            label: i18n.t('common.header.contact'),
            icon: <QuestionCircle className="contact" />,
            url: '/support'
        },
        {
            label: i18n.t('common.header.logout'),
            icon: <img src={LogoutIcon} />,
            onClick: () => {
                dispatch(actions.logout());
                utils.urlRedirect.clear();
                history.replace("/login");
            }
        }
    ];

    const CustomToggle = React.forwardRef(({children, onClick}, ref) => (
        <span
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            <PersonCircle className="trigger-icon" />
        </span>
    ));

    return <Dropdown className="header-menu">
        <Dropdown.Toggle as={CustomToggle} />

        <Dropdown.Menu>
            {
                menus.map((item, idx) => {
                    return <Dropdown.Item
                            key={idx}
                            onSelect={() => {
                                item.url && history.push(item.url); 
                                item.onClick && item.onClick();
                            }}
                        >
                        <span className="icon-wrap">{item.icon}</span>
                        {item.label}
                    </Dropdown.Item>;
                })
            }
        </Dropdown.Menu>
    </Dropdown>
}

export default HeaderMenu;
  