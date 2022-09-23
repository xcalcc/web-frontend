import React from 'react';
import classNames from 'classnames';

const TabPaneList = props => {
    const {
        activeId,
        tabsDataList
    } = props;

    return <div className="x-tabs-content">
        {
            tabsDataList.map(tab => {
                return <div 
                    key={'pane-' + tab.id}
                    className={classNames("x-tabs-pane", {
                        active: tab.id === activeId
                    })} 
                >
                    {tab.content}
                </div>
            })
        }
    </div>
}

export default TabPaneList;