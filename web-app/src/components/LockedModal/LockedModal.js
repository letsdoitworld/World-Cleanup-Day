import React from 'react';
import Modal from 'react-modal';

import { SHARED_MODAL_STYLES } from '../../shared/constants';
import closeButton from '../../assets/closeButton.png';
import googlePlayImage from '../../assets/google-play-badge.png';
import iosAppStoreImage from '../../assets/Download_on_the_App_Store_Badge_US-UK_135x40.svg';

import './LockedModal.css';

const LockedModal = ({ isOpen, onClick }) =>
  (<Modal isOpen={isOpen} style={SHARED_MODAL_STYLES} contentLabel="">
    <button className="Shared-modal-close-button" onClick={onClick}>
      <img src={closeButton} alt="" />
    </button>
    <div>
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

export default LockedModal;
