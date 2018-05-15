import React from 'react';
import PropTypes from 'prop-types';

const TERMS_URL = 'https://storeldiweuprod.blob.core.windows.net/static-resources/Admin_terms.html';

const Terms = ({ onAccept }) =>
  (<div className="Terms-container">
    <iframe title="Terms-frame" className="Terms-frame" src={TERMS_URL} />
    {onAccept &&
      <div onClick={onAccept} className="Terms-accept-button">
        <span className="Terms-accept-button-text">Accept terms</span>
      </div>}
  </div>);

Terms.propTypes = {
  onAccept: PropTypes.func,
};

Terms.defaultProps = {
  onAccept: () => {},
};

export default Terms;
