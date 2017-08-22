import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';

import googleIcon from '../../assets/Google+@2x.png';
import { actions as userActions } from '../../reducers/user';
import { BACKEND_LOGIN_SOURCES } from '../../shared/constants';
import FacebookLogin from 'react-facebook-login';
import './Popover.css';

class Popover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
    };
  }

  componentWillReceiveProps({ isOpen }, nextContext) {
    this.setState({
      isOpen,
    });
  }

  handleGoogleLoginSuccess = async res => {
    if (res.accessToken) {
      this.props.authenticate({
        network: BACKEND_LOGIN_SOURCES.GOOGLE,
        token: res.accessToken,
      });
      this.hidePopover();
    }
  };

  handleGoogleLoginFailure = err => {
    console.log(err);
  };

  hidePopover = () => {
    this.setState({
      isOpen: false,
    });
  };

  handleFacebookLoginSuccess = res => {
    if (res.accessToken) {
      this.props.authenticate({
        network: BACKEND_LOGIN_SOURCES.FACEBOOK,
        token: res.accessToken,
      });
    }
  };

  preventDefaultClick = e => {
    e.stopPropagation();
  };

  render() {
    const className = `Popover${this.state.isOpen ? ' is-open' : ''}`;
    return (
      <div className={className} onClick={this.preventDefaultClick}>
        <div className="Popover-triangle" />
        <span className="Popover-title">Admin login</span>
        <span className="Popover-subtitle">
          You can only log in if you are a country manager or area leader
        </span>
        <div className="Popover-separator" />
        <FacebookLogin
          containerStyle={{ fontWeight: 'bold' }}
          appId="340116156418708"
          autoLoad={false}
          fields="email"
          callback={this.handleFacebookLoginSuccess}
          cssClass="facebook-button-class"
          textButton="Continue with Facebook"
        />
        <GoogleLogin
          clientId="701152837929-1lqjqlhu9v3lho6vh3bsen3qbine2l8n.apps.googleusercontent.com"
          onSuccess={this.handleGoogleLoginSuccess}
          onFailure={this.handleGoogleLoginFailure}
          style={{ background: 'white', padding: 0, width: '100%' }}
        >
          <div className="ImageButton">
            <div className="ImageButton-img-container">
              <img src={googleIcon} alt="some icon" />
            </div>
            <div className="ImageButton-button">
              <span className="ImageButton-title">Continue with Google</span>
            </div>
          </div>
        </GoogleLogin>
      </div>
    );
  }
}

const mapStateToProps = dispatch => ({
  authenticate: ({ network, token }) =>
    dispatch(userActions.authenticate({ network, token })),
});

export default connect(undefined, mapStateToProps)(Popover);
