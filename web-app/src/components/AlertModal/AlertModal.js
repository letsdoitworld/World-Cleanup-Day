import React from 'react';
import Modal from 'react-modal';

import { SHARED_MODAL_STYLES } from '../../shared/constants';
import { CloseIcon } from '../common/Icons';

import './AlertModal.css';

const AlertModal = ({ message, isOpen, onClick }) =>
  (<Modal isOpen={isOpen} style={SHARED_MODAL_STYLES} contentLabel="">
    <div>
      <button
        className="CreateTrashpoint-close-button"
        onClick={this.handleCloseClick}
      >
        <CloseIcon />
      </button>
    </div>
    <button className="Shared-modal-close-button" onClick={onClick}>
      <CloseIcon />
    </button>
    <div>
      <div className="NoAuthorization-modal">
        <span className="NoAuthorization-modal-title">
          {message}
        </span>
      </div>
    </div>
  </Modal>);

export default AlertModal;
