import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { If, Else } from 'react-if';
import HeaderItem from './HeaderItem';
import Logo from './Logo';
import { TextButton } from '../Buttons';
import Popover from './Popover';
import { User } from '../User';

import {
  actions as appActions,
  selectors as appSelectors,
} from '../../reducers/app';
import './Header.css';

class Header extends Component {
  static propTypes = {
    authUser: PropTypes.oneOfType([null, PropTypes.object]),
    links: PropTypes.oneOfType([null, PropTypes.array]),
    onLogout: PropTypes.func,
    togglePopover: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    authUser: null,
    links: null,
    onLogout: () => {},
  }

  handleLoginClick = e => {
    e.stopPropagation();
    this.props.togglePopover();
  };

  render() {
    const { authUser, links, onLogout } = this.props;
    return (
      <div className="Header">
        <div className="Header-main-nav">
          <div className="Header-logo-container">
            <Logo />
          </div>
          <div className="Header-links-container">
            {
              links ?
              links.map(link => <HeaderItem {...link} key={link.title} />) :
              null
            }
          </div>
          <If condition={!!authUser}>
            <User authUser={authUser} onLogout={onLogout} />
            <Else>
              <div className="Header-button-container">
                <Popover isOpen={this.props.isOpen} />
                <TextButton title="Log in" onClick={this.handleLoginClick} />
              </div>
            </Else>
          </If>
        </div>
        <div className="Header-filters-placeholder" />
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
