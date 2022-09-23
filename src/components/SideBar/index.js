import React from "react";
import {useSelector} from "react-redux";
import {useHistory, useLocation} from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import {Image, Accordion, useAccordionToggle} from 'react-bootstrap';
import {ChevronDown} from "react-bootstrap-icons";
import i18n from 'i18next';

import myProjectIcon from 'Icons/my-projects.svg';
import settingsIcon from 'Images/icon/setting-circle.png';

import './style.scss';

const SideBar = props => {
    const appInfo = useSelector(state => state.app.appInfo);
    const isAdmin = useSelector(state => state.user.userInfo.isAdmin);
    const version = appInfo && appInfo['app'] && appInfo['app']['version'];
    const history = useHistory();
    const location = useLocation();

    const currentYear = moment().year();

    const menus = [
        {
            name: 'my-project',
            icon: myProjectIcon,
            label: i18n.t('common.sidebar.my-project'),
            enabled: true,
            url: '/dashboard',
        },
        {
            name: 'settings',
            icon: settingsIcon,
            label: i18n.t('common.sidebar.settings'),
            enabled: true,
            children: [
                {
                    name: 'license',
                    icon: '',
                    label: i18n.t('common.sidebar.license'),
                    enabled: isAdmin,
                    url: '/license',
                },
                {
                    name: 'user-management',
                    icon: '',
                    label: i18n.t('common.sidebar.user-management'),
                    enabled: isAdmin,
                    url: '/users',
                },
                {
                    name: 'email-server-configuration',
                    icon: '',
                    label: i18n.t('common.sidebar.email-server-configuration'),
                    enabled: isAdmin,
                    url: '/email-server-configuration',
                },
                {
                    name: 'data-management',
                    icon: '',
                    label: i18n.t('common.sidebar.data-management'),
                    enabled: true,
                    url: '/settings/data-management',
                },
                {
                    name: 'access-token',
                    icon: '',
                    label: i18n.t('common.sidebar.access-token'),
                    enabled: true,
                    url: '/access-token',
                },
            ]
        }
    ];
    const Menu = props => {
        const onClick = () => {
            if (props.data.url) {
                history.push(props.data.url);
            }
        }

        const menuClassNames = classNames('menu', {
            'active': location.pathname === props.data.url
        });

        return (<div className={menuClassNames} onClick={onClick}>
            {props.data.icon && <Image src={props.data.icon} className="icon"/>}
            <span className="label">
                {props.data.label}
            </span>
        </div>);
    };
    const CustomToggle = ({menu, eventKey}) => {
        const decoratedOnClick = useAccordionToggle(eventKey);
        const menuClassNames = classNames('menu', {
            'active': location.pathname === menu.url || 
                (Array.isArray(menu.children) && menu.children.findIndex(x=>x.url === location.pathname) > -1)
        });


        return (<div className={menuClassNames} onClick={decoratedOnClick}>
            {menu.icon && <Image src={menu.icon} className="icon"/>}
            <span className="label">
                {menu.label}
            </span>
            {
                !!menu.children && <span className="expand-collapse-icon"><ChevronDown/></span>
            }
        </div>);
    }

    const licenseInfo = <div className="license-info"
                             dangerouslySetInnerHTML={{__html: i18n.t('common.sidebar.license-info', {
                                     version,
                                     currentYear
                                 })}}
    />;

    return <div className="side-bar">
        <ul className="menu-wrapper">
            {
                menus.filter(menu => menu.enabled).map((menu, idx) => {
                    if (!!menu.children) {
                        return <li key={idx}>
                            <Accordion>
                                <CustomToggle menu={menu} eventKey="0"/>
                                <Accordion.Collapse eventKey="0">
                                    <ul className="submenu">
                                        {
                                            menu.children.filter(submenu => submenu.enabled).map((submenu, idx) => <li key={idx}>
                                                <Menu data={submenu}/>
                                            </li>)
                                        }
                                    </ul>
                                </Accordion.Collapse>
                            </Accordion>
                        </li>;
                    }
                    return <li key={idx}>
                        <Menu data={menu}/>
                    </li>;
                })
            }
        </ul>
        {
            licenseInfo
        }
    </div>;
}

export default SideBar;
