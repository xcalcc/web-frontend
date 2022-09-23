import React from 'react';
import classNames from 'classnames';
import CloseIcon from 'Icons/close.svg';

const TabNavList = props => {
    const {
        activeId,
        tabsDataList,
        isShowAddButton,
        onChange,
        onClose,
        onAdd,
    } = props;

    return <div className="x-tabs-nav-wrap">
        <div className="x-tabs-nav-list">
            {
                tabsDataList.map(tab => {
                    return <div 
                        key={'nav-' + tab.id}
                        className={classNames("x-tabs-tab", {
                            active: tab.id === activeId
                        })}
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(tab.id);
                        }}
                    >
                        {tab.title}
                        {
                            tab.closable &&
                            <button 
                                className="x-tabs-tab-close" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose(tab.id);
                                }}
                            >
                                <img src={CloseIcon}/>
                            </button>
                        }
                    </div>
                })
            }
        </div>
        {
            isShowAddButton &&
            <button 
                className="x-tabs-nav-add"
                onClick={onAdd}
            >
                +
            </button>
        }
    </div>
}

export default TabNavList;