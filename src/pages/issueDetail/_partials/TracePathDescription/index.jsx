import React from 'react';
import classNames from 'classnames';
import i18n from 'i18next';

import './style.scss';

const TracePathDescription = ({desc, sourceCodeRemark, isOverflowHide}) => {
    return <div className={classNames('trace-path-description', {
        'overflow-hide': desc && isOverflowHide
    })}>
        <div className="trace-path-description__content">
            <strong>{i18n.t('issueDetail.description')}</strong>
            <div>
                <p>{desc}</p>
            </div>
        </div>
    </div>
}

export default TracePathDescription;