import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { expandArea, CloseIcon } from '../common/Icons';
import './ErrorModal.css';

export const ErrorModal = ({ isVisible, errorMessage, hideModal }) =>
  (
    <div className={classnames('Errormodal', { 'Errormodal-visible': isVisible })}>
      <div className="Errormodal-header">
        <span className="Errormodal-header-title">
          Error!
        </span>
        <div onClick={hideModal} className="Errormodal-header-close">
          <CloseIcon />
        </div>
      </div>
      <img className="Coala" src={expandArea} alt="err-area-coala" />
      <p className="Errormodal-text">
        {
          errorMessage
        }
      </p>
      <div className="Errormodal-btns">
        <div
          onClick={hideModal}
          className="Errormodal-ok Errormodal-btn"
        >
          <span className="Errormodal-btn-text">OK</span>
        </div>
      </div>
    </div>
  );

ErrorModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
};
