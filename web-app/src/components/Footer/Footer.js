import React from 'react';
import FooterItem from './FooterItem';

import './Footer.css';

const Footer = () => (
  <div className="Footer">
    <div className="Footer-button-container">
      <FooterItem title="Terms and conditions" url="/terms" />
      <div className="Footer-separator" />
      <FooterItem title="Privacy policy" url="/privacy" />
    </div>
  </div>
);

export default Footer;
