import React, { Component } from 'react';
import classnames from 'classnames';
import { ArrowDownIcon, LogoutIcon } from '../common/Icons';
import './User.css';

class User extends Component {

  constructor() {
    super();
  }

  state = {
    showDetails: false
  };

  render() {
    const { authUser, onLogout } = this.props;
    return (
      <div className="User">
        <div className="User-top">
          <img className="User-pic" src={authUser.pictureURL} />
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
          className={classnames('User-cred-container', { 'is-open':  this.state.showDetails }) }
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
