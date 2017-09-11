import React from 'react';
import Modal from 'react-modal';

import { SHARED_MODAL_STYLES } from '../../shared/constants';
import closeButton from '../../assets/closeButton.png';
import googlePlayImage from '../../assets/google-play-badge.png';
import iosAppStoreImage from '../../assets/Download_on_the_App_Store_Badge_US-UK_135x40.svg';

import './AlertModal.css';

const AlertModal = ({ message, isOpen, onClick }) =>
  (<Modal isOpen={isOpen} style={SHARED_MODAL_STYLES} contentLabel="">
    <button className="Shared-modal-close-button" onClick={onClick}>
      <img src={closeButton} alt="" />
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
