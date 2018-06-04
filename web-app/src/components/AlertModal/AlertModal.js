import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { CloseIcon } from '../common/Icons';

import './AlertModal.css';

const AlertModal = ({ message, isOpen, onClick }) =>
  (<Modal
    isOpen={isOpen}
    contentLabel=""
    className="AlertModal"
    overlayClassName="AlertModal-Overlay"
  >
    <div className="AlertModal-header">
      <button className="AlertModal-close-button" onClick={onClick}>
        <CloseIcon />
      </button>
    </div>
    <div className="AlertModal-body">
      <span className="AlertModal-message">
        {message}
      </span>
    </div>
  </Modal>);

AlertModal.propTypes = {
  message: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

AlertModal.defaultProps = {
  message: '',
};

export default AlertModal;
