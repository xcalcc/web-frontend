import React, {useState} from 'react';
import classNames from "classnames";
import Scrollbar from 'react-scrollbars-custom';
import * as utils from 'Utils';
import './style.scss';

const DataList = props => {
    const SORY_BY = {
        RULE_CODE: 1,
        RULE_COUNT: 2
    };

    const [groupSortBy, setGroupSortBy] = useState(SORY_BY.RULE_CODE);

    const handleSort = () => {
        if(!props.groupId) return;
        const sortBy = groupSortBy === SORY_BY.RULE_CODE ? SORY_BY.RULE_COUNT : SORY_BY.RULE_CODE;
        utils.scanResultHelper.sortCriticalityGroupData(props.groupId, props.items, sortBy);
        setGroupSortBy(sortBy);
    }
    return <div className="filter-with-rules_data-list">
        <p 
            className={classNames("title", props.groupId)}
            onClick={handleSort}
        >
            {props.title}
            {
                props.groupId && 
                <span className={classNames('sort-label', {
                    up: groupSortBy === SORY_BY.RULE_CODE,
                    down: groupSortBy === SORY_BY.RULE_COUNT
                })}/>
            }
        </p>
        <div className="item-list-wrap">
            <Scrollbar 
                noScrollX
                noScrollY={props.noScrollY}
            >
                <ul>
                    {
                        props.items && props.items.map((item, idx) => {
                            return <li
                                key={idx}
                                onClick={() => props.onSelect && props.onSelect(item)}
                                className={classNames({
                                    selected: props.selected && props.selected.includes(item.id)
                                })}
                            >
                                <strong>{item.label}</strong>
                                <span>{utils.formatNumber(item.value)}</span>
                            </li>;
                        })
                    }
                </ul>
            </Scrollbar>
        </div>
    </div>;
}

export default DataList;