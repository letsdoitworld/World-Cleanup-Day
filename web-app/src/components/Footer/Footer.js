import React, { Component } from 'react';
import { connect } from 'react-redux';
import FooterItem from './FooterItem'

import './Footer.css';

class Footer extends Component {

  render() {
    return (
      <div className="Footer">
        <div className="Footer-button-container">
          <FooterItem title="Terms and conditions" url="/terms" />
          <div className="Footer-separator" />
          <FooterItem title="Privacy policy" url="/privacy" />
        </div>
      </div>
    );
  }
}


export default connect()(Footer);
