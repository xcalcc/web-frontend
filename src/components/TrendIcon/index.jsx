import React from 'react';
import {Image} from 'react-bootstrap';

import SignUpIcon from 'Icons/indicator_up.svg';
import SignDownIcon from 'Icons/indicator_down.svg';
import SignFlatIcon from 'Icons/indicator_flat.svg';

const TrendIcon = ({value, baselineValue}) => {
    let icon = null;

    if(baselineValue === null || baselineValue === undefined) {
        return null;
    }

    const diff = Number(value) - Number(baselineValue);
    switch(Math.sign(diff)) {
        case 1:
            icon = <Image src={SignUpIcon} />
            break;
        case -1:
            icon = <Image src={SignDownIcon} />
            break;
        case 0:
            icon = <Image src={SignFlatIcon} />
            break;
        default:
            break;
    }
    return icon;
}

export default TrendIcon;