import React, {useState, useEffect} from 'react';
import classNames from "classnames";
import {XDropdown} from 'Components/Form';
import './style.scss';

const DropdownWithEdit = props => {
    const [isLabel, setIsLabel] = useState(true);

    const handleClick = e => {
        setIsLabel(false);
    }

    const documentClick = (e) => {
        let isDropdown = false;
        for(let i in e.path) {
            let dom = e.path[i];
            if(!!dom && String(dom.className).includes('dropdown-with-edit')) {
                isDropdown = true;
                break;
            }
        }

        !isDropdown && setIsLabel(true);
    };

    useEffect(() => {
        document.addEventListener('click', documentClick);
        return () => document.removeEventListener('click', documentClick);
    }, []);

    return (
        <div 
            className="dropdown-with-edit"
            onClick={handleClick}
        >
            <XDropdown 
                {...props}
                className={
                    classNames({
                        'as-label': isLabel
                    }, props.className)
                }
            />
        </div>
    )
}

export default DropdownWithEdit;