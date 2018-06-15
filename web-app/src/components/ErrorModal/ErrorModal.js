import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { expandArea, CloseIcon } from '../common/Icons';

export const ErrorModal = ({ isVisible, errorMessage, hideModal }) =>
  (
    <div className={classnames('Expand-area-modal', { 'Expand-area-modal-visible': isVisible })}>
      <div className="Expand-area-modal-header">
        <span className="Expand-area-modal-header-title">
          Error!
        </span>
        <div onClick={hideModal} className="Expand-area-modal-header-close">
          <CloseIcon />
        </div>
      </div>
      <img className="Coala" src={expandArea} alt="expand-area-coala" />
      <p className="Expand-area-modal-text">
        {
          errorMessage
        }
      </p>
      <div className="Expand-area-modal-btns">
        <div
          onClick={hideModal}
          className="Expand-area-modal-cancel Expand-area-modal-btn"
        >
          <span className="Terms-accept-button-text">OK</span>
        </div>
      </div>
    </div>
  );

ErrorModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
};
