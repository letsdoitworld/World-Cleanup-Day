import React from 'react';
import Modal from 'react-modal';

import { SHARED_MODAL_STYLES } from '../../shared/constants';
import closeButton from '../../assets/closeButton.png';
import googlePlayImage from '../../assets/google-play-badge.png';
import iosAppStoreImage from '../../assets/Download_on_the_App_Store_Badge_US-UK_135x40.svg';

import './AuthModal.css';

const AuthModal = ({ isOpen, onClick }) =>
  (<Modal isOpen={isOpen} style={SHARED_MODAL_STYLES} contentLabel="">
    <button className="Shared-modal-close-button" onClick={onClick}>
      <img src={closeButton} alt="" />
    </button>
    <div>
      <div className="NoAuthorization-modal">
        <span className="NoAuthorization-modal-title">
          {
            "You don't have the required permissions to access the admin dashboard."
          }
        </span>
        <span className="NoAuthorization-modal-subtitle">
          Please download the app from the links below:
        </span>
        <div className="NoAuthorization-modal-links-container">
          <a
            href="https://play.google.com/store/apps/details?id=com.teeme.ldi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={googlePlayImage} alt="" width="150px" />
          </a>
          <a
            href="https://itunes.apple.com/us/app/world-cleanup/id1237553057?ls=1&mt=8"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={iosAppStoreImage} alt="" />
          </a>
        </div>
        <span className="NoAuthorization-modal-legal">
          Google Play and the Google Play logo are trademarks of Google Inc.
          <br />
          Apple and the Apple logo are trademarks of Apple Inc., registered in
          the U.S. and other countries. App Store is a service mark of Apple
          Inc., registered in the U.S. and other countries.
        </span>
      </div>
    </div>
  </Modal>);

export default AuthModal;
