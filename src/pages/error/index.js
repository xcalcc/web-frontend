import React from 'react';
import i18n from 'i18next';
import './style.scss';

const Index = () => {
  return (
    <div className="middle-content error-page">
      <div className="alert alert-warning text-center">
        <h4>
          <i className="icon fa" /> {i18n.t('error.error')}
        </h4>
        <span>{i18n.t('error.system.not-authorized')}</span>
      </div>
    </div>
  );
};

export default Index;
