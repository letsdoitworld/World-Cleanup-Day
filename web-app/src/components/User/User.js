import React, { Component } from 'react';
import { ArrowDownIcon } from '../common/Icons'
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
            onClick={()=> this.setState({showDetails: !this.state.showDetails})}
          >
            <ArrowDownIcon />
          </button>
        </div>
        <div className={`User-cred-container ${this.state.showDetails ? 'is-open' : ''}`}>
          <p>{authUser.email}</p>
          <button onClick={()=> onLogout()}>Log out</button>
        </div>
      </div>
    )
  }
}

export default User
