import React from 'react';
import FooterItem from './FooterItem';

import './Footer.css';

const Footer = () => (
  <div className="Footer">
    <div className="Footer-button-container">
      <FooterItem title="Terms and conditions" url="/terms" />
      <div className="Footer-separator" />
      <FooterItem title="Privacy policy" url="/privacy" />
      <div className="Footer-separator" />
      <FooterItem title="Try our app" url="/try-our-app" />
    </div>
  </div>
);

export default Footer;
