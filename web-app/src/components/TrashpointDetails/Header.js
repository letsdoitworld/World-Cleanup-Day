import React from 'react';
import { connect } from 'react-redux';
import { MinimizeIcon, CloseIcon } from '../../components/common/Icons';
import { selectors } from '../../reducers/trashpile';

const TpdetailsHeader = ({
  tpTitle,
  onMinimizeClick,
}) => {
  return (
    <div className="Tpdetails-header">
      <span className="Tpdetails-header-title">{tpTitle}</span>
      <div
        className="Tpdetails-header-minimize"
        onClick={() => onMinimizeClick()}
      >
        <CloseIcon />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(TpdetailsHeader);
