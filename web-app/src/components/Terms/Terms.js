import React from 'react';
import PropTypes from 'prop-types';
import { If } from 'react-if';
import { Link } from 'react-router-dom';
import { CloseIcon } from '../../components/common/Icons';
import { noop } from '../../shared/helpers';

const TERMS_URL =
'https://storeldiweuprod.blob.core.windows.net/static-resources/terms_new.html';

const Terms = ({ onAccept, onDecline, ifCastShadow }) =>
  (<div className="Terms-container scrollbar-modified">
    <div className="Terms-cover" />
    <div className="Terms-header">
      <span className="Terms-header-title">Terms and conditions</span>
      <div onClick={onDecline || noop} className="Terms-header-close">
        <Link to="/trashpoints">
          <CloseIcon />
        </Link>
      </div>
    </div>
    <iframe title="Terms-frame" className="Terms-frame" src={TERMS_URL} />
    <If condition={!!onAccept}>
      <div className="Terms-choises">
        <div onClick={onAccept} className="Terms-button Terms-accept">
          <span className="Terms-accept-button-text">Accept</span>
        </div>
        <div onClick={onDecline} className="Terms-button Terms-decline">
          <span className="Terms-decline-button-text">Decline</span>
        </div>
      </div>
    </If>
  </div>);

Terms.propTypes = {
  onAccept: PropTypes.func,
  onDecline: PropTypes.func,
  ifCastShadow: PropTypes.bool,
};

Terms.defaultProps = {
  onAccept: null,
  onDecline: null,
  ifCastShadow: false,
};

export default Terms;
