import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import { SHARED_MODAL_STYLES } from '../../shared/constants';
import {
  CloseIcon,
} from '../common/Icons';

import './LockedModal.css';

const LockedModal = ({ isOpen, onClick }) =>
  (<Modal isOpen={isOpen} style={SHARED_MODAL_STYLES} contentLabel="">
    <div className="Locked-header">
      <span className="Locked-placeholder" />
      <button className="Shared-modal-close-button" onClick={onClick}>
        <CloseIcon />
      </button>
    </div>
    <div className="Locked-body">
      <div className="NoAuthorization-modal">
        <span className="NoAuthorization-modal-title">
          Your account is locked.
        </span>
        <span className="NoAuthorization-modal-subtitle">
          Please contact an administrator for more details
        </span>
      </div>
    </div>
  </Modal>);

LockedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default LockedModal;
