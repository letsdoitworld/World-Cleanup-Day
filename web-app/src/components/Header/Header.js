import React, { Component } from 'react';
import { connect } from 'react-redux';
import HeaderItem from './HeaderItem'
import Logo from './Logo';
import { TextButton } from '../Buttons';
import Popover from './Popover';
import { User } from '../User';
import { Link } from 'react-router-dom';

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
    const {authUser, links, bottomLinks, onLogout, logoutText} = this.props;
    return (
      <div className="Header">
        <div className="Header-logo-container">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        {
          links ?
          <div className="Header-links-container">
            {links.map((link, index) => <HeaderItem {...link} key={index} />)}
          </div> :
          null
        }
        {
          authUser ?
          <User authUser={authUser} onLogout={onLogout} /> :
          <div className="Header-button-container">
            <Popover isOpen={this.props.isOpen} />
            <TextButton title="Log in" onClick={this.handleLoginClick} />
          </div>
        }
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

/*
<HeaderItem title="Log out" onClick={onLogout} />

{authUser && (
  <HeaderItem title={authUser.name} />
)}
{authUser && <HeaderItem title={authUser.email} />}
*/
