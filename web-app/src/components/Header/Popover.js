import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { actions as userActions } from '../../reducers/user';
import { actions as appActions } from '../../reducers/app';
import { BACKEND_LOGIN_SOURCES } from '../../shared/constants';
import { FbIcon, GoogleIcon, CloseIcon } from '../common/Icons';
import demo from '../../assets/demo-login.png';
import './Popover.css';

class Popover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
    };
  }

  componentWillReceiveProps({ isOpen }) {
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
    this.props.hidePopover();
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
      this.hidePopover();
    }
  };

  preventDefaultClick = e => {
    e.stopPropagation();
  };

  render() {
    const { hidePopover } = this.props;
    return (
      <div
        className={`Popover-container${this.state.isOpen ? ' is-open' : ''}`}
        onClick={this.preventDefaultClick}
      >
        <div className="Popover-cover" />
        <div className="Popover">
          <div className="Popover-header">
            <span className="Popover-title">Log in</span>
            <button
              className="Popover-hide"
              onClick={() => hidePopover()}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="Popover-img">
            <img src={demo} alt="popover-demo" />
          </div>
          <div className="Popover-body">
            <div className="Popover-login-item-container Fb-login-container">
              <div className="Fb-login-btn-head" />
              <FacebookLogin
                containerStyle={{ fontWeight: 'bold' }}
                appId="340116156418708"
                autoLoad={false}
                fields="email"
                callback={this.handleFacebookLoginSuccess}
              >
                <div className="Fb-login-btn Popover-login-item">
                  <FbIcon />
                  <span>Continue with Facebook</span>
                </div>
              </FacebookLogin>
            </div>
            <div className="Popover-login-item-container Google-login-container">
              <div className="Google-login-btn-head" />
              <GoogleLogin
                clientId="701152837929-1lqjqlhu9v3lho6vh3bsen3qbine2l8n.apps.googleusercontent.com"
                onSuccess={this.handleGoogleLoginSuccess}
                onFailure={this.handleGoogleLoginFailure}
                style={{ background: 'none', width: '100%' }}
              >
                <div className="Google-login-btn Popover-login-item">
                  <GoogleIcon />
                  <span>Continue with Google+</span>
                </div>
              </GoogleLogin>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  authenticate: ({ network, token }) =>
    dispatch(userActions.authenticate({ network, token })),
  hidePopover: () => dispatch(appActions.hideLoginPopover()),
});

export default connect(undefined, mapDispatchToProps)(Popover);
