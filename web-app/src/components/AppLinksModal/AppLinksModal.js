import React from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon } from '../../components/common/Icons';
import googlePlayImage from '../../assets/btn-google-play.png';
import iosAppStoreImage from '../../assets/btn-app-store.png';

import './AppLinksModal.css';

const AppLinksModal = () =>
  (<div className="AppLinks-container">
    <div className="AppLinks-header">
      <span className="AppLinks-header-title">Try our app</span>
      <div className="AppLinks-header-close">
        <Link to="/">
          <CloseIcon />
        </Link>
      </div>
    </div>
    <div>
      <div className="AppLinks-body">
        <p className="AppLinks-body-subtitle">
          World cleanup day
        </p>
        <p className="AppLinks-body-slogan">
          Map waste and change the world! Download our app from the links below:
        </p>
        <div className="AppLinks-body-links-container">
          <a
            href="https://play.google.com/store/apps/details?id=com.teeme.ldi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={googlePlayImage} alt="" />
          </a>
          <a
            href="https://itunes.apple.com/us/app/world-cleanup/id1237553057?ls=1&mt=8"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={iosAppStoreImage} alt="" />
          </a>
        </div>
        {
          /*
          <span className="AppLinks-body-legal">
            Google Play and the Google Play logo are trademarks of Google Inc.
            <br />
            Apple and the Apple logo are trademarks of Apple Inc., registered in
            the U.S. and other countries. App Store is a service mark of Apple
            Inc., registered in the U.S. and other countries.
          </span>
          */
        }
      </div>
    </div>
  </div>);

export default AppLinksModal;
