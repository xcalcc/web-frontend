import React from 'react';
import TabNavList from './TabNavList';
import TabPaneList from './TabPaneList';

import './style.scss';

const Tabs = props => {
    const {
        activeId,
        tabsDataList,
        isShowAddButton,
        onChange,
        onClose,
        onAdd,
    } = props;

    if(!tabsDataList) return null;

    return <div className="x-tabs">
        <TabNavList 
            activeId={activeId} 
            tabsDataList={tabsDataList} 
            isShowAddButton={isShowAddButton}
            onChange={onChange}
            onClose={onClose}
            onAdd={onAdd}
        />
        <TabPaneList 
            activeId={activeId} 
            tabsDataList={tabsDataList} 
        />
    </div>
}

export default Tabs;