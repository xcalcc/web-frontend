import React, {useEffect, useMemo} from "react";
import AlertPrompt from "Containers/AlertPrompt";
import Notifications from "Containers/Notifications";
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as actions from 'Actions';
import classNames from "classnames";
import $ from "jquery";
import * as utils from "Utils";
import enums from "Enums";
import routes from './router';
import BasicTheme from 'Containers/Theme';
import "./App.scss";

utils.setAppFrom();
utils.setDevMode();
utils.urlRedirect.autoSet();

const App = props => {
    const dispatch = useDispatch();
    const history = useHistory();
    const isAdmin = useSelector(state => state.user.userInfo.isAdmin);

    const addEvent = () => {
        $(".action-link").click(function () {
            $(this)
                .prev(".input-group")
                .children(".input-field")
                .prop("disabled", false);
            $(this)
                .parent(".wrap-div")
                .removeClass("disable-group");
            //$(this).next(".action-button").slideDown("slow");
        });

        $(window).click(function () {
            $(".wrap-div").addClass("disable-group");
            $(".disable-group .input-field").attr("disabled", "disabled");
        });

        $(".disable-group .input-field,.action-link").click(function (event) {
            event.stopPropagation();
        });

        /*Script for custom input file*/
        document.querySelector("html").classList.add("js");

        var fileInput = document.querySelector(".input-file"),
            button = document.querySelector(".input-file-trigger");

        if (button) {
            button.addEventListener("keydown", function (event) {
                if (event.keyCode === 13 || event.keyCode === 32) {
                    fileInput.focus();
                }
            });
        }
        if (button) {
            button.addEventListener("click", function (event) {
                fileInput.focus();
                return false;
            });
        }
    }
    const autoLogin = () => {
        const queryData = utils.queryString();
        if(queryData.token) {
            utils.localStore.set('tokenType', 'Bearer');
            utils.localStore.set('accessToken', queryData.token);

            // remove the token parameter from the URL
            delete queryData.token;

            let urlSearch = '';
            if(!utils.isEmptyObject(queryData)) {
                urlSearch = Object.keys(queryData).reduce((acc, key) => `${key}=${queryData[key]}&${acc}`, '');
            }

            const url = window.location.pathname + (urlSearch ? `?${urlSearch}` : '');

            history.push(url);
        }
    }

    const isLogin = () => dispatch(actions.isLogin());

    useMemo(() => {
        autoLogin();
    }, []);

    useEffect(() => {
        (async () => {
            await dispatch(actions.fetchAppInfo());
            isLogin() && await dispatch(actions.getUserInfo());
        })();

        addEvent();
    }, []);

    return (
        <React.Fragment>
            <main className={classNames(
                'app',
                {
                    'mac-os': navigator.userAgent.indexOf("Mac") > -1,
                    'chrome': navigator.userAgent.indexOf("Chrome") > -1,
                    'safari': navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Version") > -1,
                    'chinese': utils.isChinese(),
                }
            )}>
                <Switch>
                    {
                        routes.filter(route => {
                            if (route.needAdmin && !isAdmin) {
                                return false;
                            }
                            return true;
                        }).map((route, idx) => <Route
                            key={idx}
                            exact={!!route.exact}
                            path={route.path}
                            render={props => {
                                if (utils.getAppFrom() !== enums.APP_FROM.ANT) {
                                    if (route.protected && !isLogin()) {
                                        return <Redirect to="/login"/>;
                                    }
                                }
                                if (route.redirect && isLogin()) {
                                    return <Redirect to={route.redirect}/>;
                                }

                                if (!route.enabled) {
                                    return <Redirect to="/dashboard"/>;
                                }
                                if (route.render) {
                                    return route.render(props);
                                }
                                const Component = route.pageComponent;

                                if (utils.getAppFrom() === enums.APP_FROM.ANT) {
                                    return <Component pageName={route.name} {...props} />;
                                }

                                return <BasicTheme
                                    header={route.header}
                                    sidebar={route.sidebar}
                                >
                                    <Notifications pageName={route.name} />
                                    <Component pageName={route.name} {...props} />
                                </BasicTheme>;
                            }}
                        />)
                    }

                    <Redirect from="/" exact to="/login"/>
                    <Redirect to="/not-found"/>
                </Switch>
                <AlertPrompt/>
            </main>
        </React.Fragment>

    );
}

export default App;
