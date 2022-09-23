import React from 'react';
import i18n from 'i18next';
import './style.scss';

const TotalPaths = ({total}) => {
    return <div className="issue-detail__header__total-paths">
        <p className="title">{i18n.t('issueDetail.of-paths')}</p>
        <div className="total">
            <span className="number">
                {total}
            </span>
        </div>
    </div>;
}

export default TotalPaths;