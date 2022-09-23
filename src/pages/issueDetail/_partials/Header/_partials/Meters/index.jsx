import React from 'react';
import Meter from 'Components/Meter';
import {MetersProvider} from "./MetersProvider";

import './style.scss';

const Meters = ({issueGroup}) => {
    let dataProvider;
    let meterDataList = [];

    dataProvider = new MetersProvider();
    meterDataList = dataProvider.provider(issueGroup);

    return <div className="issue-detail__header__meters">
        {
            meterDataList.map((item, index) => {
                return (
                    <Meter
                        key={index + item.value}
                        title={item.title}
                        value={item.value}
                        valueName={item.valueName}
                        valueNameClass={item.valueNameClass}
                    />
                )
            })
        }
    </div>;
}

export default Meters;