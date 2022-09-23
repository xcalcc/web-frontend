import React from 'react';
import i18n from 'i18next';
import {Prompt, withRouter} from "react-router-dom";
import ConfirmPrompt from 'Containers/ConfirmPrompt';

const withAlertOnExit = WrappedComponent => {
    return class extends React.PureComponent {
        state = {
            shouldBlockNavigation: false,
            title: null,
            modalVisible: false,
            lastLocation: null,
            confirmedNavigation: false
        };

        blockNavigation = title => this.setState({
            shouldBlockNavigation: true,
            title: title
        });

        unblockNavigation = () => this.setState({
            shouldBlockNavigation: false,
            title: null
        });

        closeModal = () => {
            this.setState({
                modalVisible: false
            });
        };

        showModal = (location) => {
            this.setState({
                modalVisible: true,
                lastLocation: location,
            });
        };

        handleBlockedNavigation = (nextLocation) => {
            const {confirmedNavigation} = this.state;
            if (!confirmedNavigation) {
                this.showModal(nextLocation);
                return false;
            }

            return true;
        };

        handleConfirmNavigationClick = () => {
            const {lastLocation} = this.state;
            if (lastLocation) {
                this.setState({
                    confirmedNavigation: true
                }, () => {
                    this.props.history.push(lastLocation.pathname);
                })
            }
        };

        render() {
            return (
                <>
                    <WrappedComponent
                        {...this.props}
                        blockNavigation={this.blockNavigation}
                        unblockNavigation={this.unblockNavigation}
                    />
                    <Prompt
                        when={this.state.shouldBlockNavigation}
                        message={this.handleBlockedNavigation}
                    />
                    {this.state.modalVisible ? (
                        <ConfirmPrompt
                            show={this.state.modalVisible}
                            title={this.state.title}
                            cancelBtnText={i18n.t('common.buttons.cancel')}
                            confirmBtnText={i18n.t('common.buttons.confirm')}
                            contentText={i18n.t('common.delete-tip')}
                            onConfirm={this.handleConfirmNavigationClick}
                            onCancel={() => this.closeModal()}
                            onHide={() => this.hideConfirmAlert()}
                        />
                    ) : null}
                </>
            );
        }
    }
};

export default WrappedComponent => withRouter(withAlertOnExit(WrappedComponent));