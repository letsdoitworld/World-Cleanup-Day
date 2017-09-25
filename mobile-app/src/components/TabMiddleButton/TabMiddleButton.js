import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { handleSentryError } from '../../shared/helpers';
import { withCameraActions } from '../../services/Camera';
import ImageService from '../../services/Image';
import {
  selectors as locationSels,
  operations as locationOps,
} from '../../reducers/location';

import ButtonPopover from './components/ButtonPopover';

import { Popover } from '../Popover';

import styles from './styles';
import {
  operations as appOperations,
  selectors as appSelectors,
} from '../../reducers/app';

class TabMiddleButton extends Component {
  static defaultProps = {
    onPopoverShow: undefined,
  };
  static propTypes = {
    wasPopoverShown: PropTypes.bool.isRequired,
    popoverMessage: PropTypes.string.isRequired,
    onPopoverShow: PropTypes.func,
    navigation: PropTypes.object.isRequired,
    locationActive: PropTypes.bool.isRequired,
    showLocationErrorModal: PropTypes.func.isRequired,
    takePhotoAsync: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { popoverShow: false };

    if (!props.wasPopoverShown) {
      this.onPopoverShow();
      const timer = setTimeout(() => {
        this.setState({ showPopover: true });
        clearTimeout(timer);
      }, 1000);
    }
  }

  onPopoverShow = () => {
    if (this.props.onPopoverShow) {
      this.props.onPopoverShow();
    }
  };
  locationActiveGuard = () => {
    const { locationActive } = this.props;
    if (!locationActive) {
      this.props.showLocationErrorModal();
      return false;
    }
    return true;
  };
  handlePress = async () => {
    if (!this.locationActiveGuard()) {
      return;
    }
    try {
      const {
        cancelled,
        uri,
        base64,
        width,
        height,
      } = await this.props.takePhotoAsync({ quality: 0.2, base64: true });
      if (cancelled) {
        return;
      }
      const thumbnailBase64 = await ImageService.getResizedImageBase64({
        uri,
        width,
        height,
      });
      const { navigation, userLocation } = this.props;
      navigation.navigate('CreateMarker', {
        photos: [{ uri, thumbnail: { base64: thumbnailBase64 }, base64 }],
        coords: userLocation,
      });
    } catch (e) {
      handleSentryError(e);
      console.log(e.message);
    }
  };
  handleOnClosePopover = () => {
    this.setState({ showPopover: false });
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <View style={styles.container}>
          <Ionicons name={'ios-add-circle-outline'} size={24} color={'white'} />
          {this.state.showPopover &&
          <Popover show onRequestClose={this.handleOnClosePopover}>
            <ButtonPopover
              onPress={this.handleOnClosePopover}
              popoverMessage={this.props.popoverMessage}
            />
          </Popover>}
        </View>

      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  wasPopoverShown: appSelectors.wasPopoverShown(state),
  popoverMessage: appSelectors.getPopoverMessage(state),
  userLocation: locationSels.userLocationSelector(state),
  locationActive: locationSels.hasLocationActive(state),
});

const mapDispatchToProps = {
  onPopoverShow: appOperations.setPopoverShown,
  showLocationErrorModal: locationOps.setErrorModalVisible,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withCameraActions(),
)(TabMiddleButton);
