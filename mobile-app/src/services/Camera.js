import React from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';

import strings from '../assets/strings'

import { AlertModal } from '../components/AlertModal';
const checkPermissions = async () => {
  const { status } = await Permissions.getAsync(Permissions.CAMERA);

  if (status !== 'granted') {
    const { status: askStatus } = await Permissions.askAsync(
      Permissions.CAMERA,
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
      const permitted = await checkPermissions();
      if (!permitted) {
        this.showWarning();
        return { cancelled: true };
      }
      if (!Constants.isDevice) {
        return ImagePicker.launchImageLibraryAsync(options);
      }
      return ImagePicker.launchCameraAsync(options);
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
        android: strings.label_camera_permission_warning_android,
        ios: strings.label_camera_permission_warning_ios,
      });
      return (
        <View style={{ flex: 1 }}>
          <AlertModal
            title={"dddd"}
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
