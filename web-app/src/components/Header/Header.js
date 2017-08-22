import React, { Component } from 'react';
import { connect } from 'react-redux';

import Logo from './Logo';
import { RoundButton } from '../Buttons';
import Popover from './Popover';
import {
  actions as appActions,
  selectors as appSelectors,
} from '../../reducers/app';
import './Header.css';

class Header extends Component {
  handleLoginClick = e => {
    e.stopPropagation();
    this.props.togglePopover();
  };

  render() {
    return (
      <div className="Header">
        <div className="Header-logo-container">
          <Logo />
        </div>
        <div className="Header-button-container">
          <Popover isOpen={this.props.isOpen} />
          <RoundButton title="Log in" onClick={this.handleLoginClick} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: appSelectors.getShowLoginPopover(state),
});

const mapDispatchToProps = {
  togglePopover: appActions.toggleLoginPopover,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
