import React, { PureComponent } from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';
import { CLIENT_ERRORS } from '../../shared/constants';
import { Badges } from '../../assets/images';
import strings from '../../assets/strings';
import AlertModal from '../../components/AlertModal/AlertModal';

// const noop = () => null;
export default class ErrorModal extends PureComponent {
  componentWillUnmount() {
    this.props.onSetError(undefined);
  }

  closeModal = () => {
    this.props.onSetError(undefined);
    if (Platform.OS === 'ios') {
      // This is nessessary check for ios.
      this.props.navigator.dismissModal();
    }
    Navigation.dismissLightBox();
  };

  render() {
    let message;
    let subtitle;
    let image;
    const title = strings.label_leave_title;
    switch (this.props.error) {
      case CLIENT_ERRORS.networkError :
        message = strings.label_error_network_text;
        subtitle = strings.label_error_network_subtitle;
        image = Badges.NoConnection;
        break;
      case CLIENT_ERRORS.registerTPError:
        message = strings.label_private_auth_trashpoint_wor;
        subtitle = strings.label_register_now;
        image = Badges.RegisterNow;
        break;
      case CLIENT_ERRORS.registerEventError:
        message = strings.label_private_auth_wor;
        subtitle = strings.label_register_now;
        image = Badges.RegisterNow;
        break;
      case CLIENT_ERRORS.privacyError:
        message = strings.label_private_profile_wor;
        subtitle = strings.label_private_profile_wor_title;
        image = Badges.Privacy;
        break;
      case CLIENT_ERRORS.error400:
      case CLIENT_ERRORS.error403:
      case CLIENT_ERRORS.error404:
      case CLIENT_ERRORS.error500:
        message = strings.label_something_went_wrong;
        subtitle = strings.label_error_message;
        image = Badges.NoConnection;
        break;
      default:
        message = this.props.error;
        subtitle = strings.label_error_message;
        image = Badges.NoConnection;
    }
    return (<View>
      <AlertModal
        onOverlayPress={this.closeModal}
        onPress={this.closeModal}
        visible
        title={title}
        image={image}
        subtitle={subtitle}
        text={message}
        buttons={this.props.buttons ? this.props.buttons : []}
      />
    </View>
    );
  }
}

ErrorModal.propTypes = {
  error: PropTypes.string.isRequired,
  onSetError: PropTypes.func,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onPress: PropTypes.func.isRequired,
      style: PropTypes.any,
    }),
  ),
};
