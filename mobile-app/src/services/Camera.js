import React from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { ImagePicker, Constants, Permissions } from 'expo';
import i18n from '../config/i18n';

import { AlertModal } from '../components/AlertModal';
const checkPermissions = async type => {
  const { status } = await Permissions.getAsync(type);

  if (status !== 'granted') {
    const { status: askStatus } = await Permissions.askAsync(
      type,
    );

    return askStatus === 'granted';
  }
  return true;
};

export const withCameraService = () => (Component) => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        warning: false,
      };

      this.buttons = [
        {
          text: 'Ok',
          onPress: this.hideWarning,
        },
      ];
    }
    static childContextTypes = {
      pickPhotoAsync: PropTypes.func.isRequired,
      takePhotoAsync: PropTypes.func.isRequired,
    };
    getChildContext() {
      const { pickPhotoAsync, takePhotoAsync } = this;
      return {
        pickPhotoAsync,
        takePhotoAsync,
      };
    }
    pickPhotoAsync = async (options) => {
      const permitted = await checkPermissions();
      if (!permitted) {
        this.showWarning();
        return { cancelled: true };
      }
      return ImagePicker.launchImageLibraryAsync(options);
    };
    takePhotoAsync = async (options) => {
      const permittedCamera = await checkPermissions(Permissions.CAMERA);
      const permittedCameraRoll = await checkPermissions(Permissions.CAMERA_ROLL);
      if (!permittedCamera || !permittedCameraRoll) {
        this.showWarning();
        return { cancelled: true };
      }
      if (!Constants.isDevice) {
        return await ImagePicker.launchImageLibraryAsync(options);
      }
      return await ImagePicker.launchCameraAsync();
    };
    showWarning = () => {
      this.setState({
        warning: true,
      });
    };
    hideWarning = () => {
      this.setState({
        warning: false,
      });
    };

    render() {
      const CAMERA_MSG = Platform.select({
        android: i18n.t('label_camera_permission_warning_android'),
        ios: i18n.t('label_camera_permission_warning_ios'),
      });
      return (
        <View style={{ flex: 1 }}>
          <AlertModal
            title={i18n.t('Camera Access Denied')}
            subtitle={CAMERA_MSG}
            visible={this.state.warning}
            buttons={this.buttons}
            onOverlayPress={this.hideWarning}
          />
          <Component {...this.props} />
        </View>
      );
    }
  };
};
export const withCameraActions = () => (Component) => {
  return class extends React.Component {
    static contextTypes = {
      takePhotoAsync: PropTypes.func.isRequired,
      pickPhotoAsync: PropTypes.func.isRequired,
    };
    render() {
      const { takePhotoAsync, pickPhotoAsync } = this.context;
      return (
        <Component
          {...this.props}
          takePhotoAsync={takePhotoAsync}
          pickPhotoAsync={pickPhotoAsync}
        />
      );
    }
  };
};
