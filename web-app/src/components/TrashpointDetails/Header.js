import React from 'react';
import PropTypes from 'prop-types';
import { CloseIcon } from '../../components/common/Icons';

const TpdetailsHeader = ({
  tpTitle,
  onMinimizeClick,
}) => {
  return (
    <div className="Tpdetails-header">
      <span className="Tpdetails-header-title">{tpTitle}</span>
      <div
        className="Tpdetails-header-minimize"
        onClick={onMinimizeClick}
      >
        <CloseIcon />
      </div>
    </div>
  );
};

TpdetailsHeader.propTypes = {
  tpTitle: PropTypes.string.isRequired,
  onMinimizeClick: PropTypes.func.isRequired,
};

export default TpdetailsHeader;
