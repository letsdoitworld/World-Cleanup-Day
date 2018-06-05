import React from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon } from '../../components/common/Icons';

const TERMS_URL =
  'https://storeldiweuprod.blob.core.windows.net/static-resources/privacy_new.html';

const Privacy = () =>
  (<div className="Privacy-container">
    <div className="Privacy-header">
      <span className="Privacy-header-title">Privacy Policy</span>
      <div className="Privacy-header-close">
        <Link to="/trashpoints">
          <CloseIcon />
        </Link>
      </div>
    </div>
    <iframe title="Privacy-frame" className="Privacy-frame" src={TERMS_URL} />
  </div>);

export default Privacy;
