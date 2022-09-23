import React from 'react';
import i18n from 'i18next';
import {XCircle} from 'react-bootstrap-icons';
import './style.scss';

const Index = () => {
  return (
    <div className="middle-content notfound-page">
      <div className="alert alert-danger text-center">
        <h4>
          <XCircle /> {i18n.t('error.error')}
        </h4>
        <span id="successMsg">{i18n.t('error.system.page-not-found')}</span>
      </div>
    </div>
  );
};

export default Index;
