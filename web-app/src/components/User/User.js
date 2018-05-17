import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { ArrowDownIcon, LogoutIcon } from '../common/Icons';
import './User.css';

class User extends Component {

  static propTypes = {
    authUser: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      locked: PropTypes.bool,
      pictureURL: PropTypes.string,
      public: PropTypes.bool,
      termsAcceptedAt: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    }),
    onLogout: PropTypes.func.isRequired,
  }

  static defaultProps = {
    authUser: null,
  }

  state = {
    showDetails: false,
  }

  render() {
    const { authUser, onLogout } = this.props;
    return (
      <div className="User">
        <div className="User-top">
          <img className="User-pic" src={authUser.pictureURL} alt="user-pic" />
          <span className="User-name">{authUser.name}</span>
          <button
            className="Toggle-user-info"
            onClick={
              () => this.setState({ showDetails: !this.state.showDetails })
            }
          >
            <ArrowDownIcon />
          </button>
        </div>
        <div
          className={
            classnames(
              'User-cred-container',
              { 'is-open': this.state.showDetails })
            }
          onClick={onLogout}
        >
          <LogoutIcon />
          <span>Log out</span>
        </div>
      </div>
    );
  }
}

export default User;
