import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback, Text } from 'react-native';

import Camera from '../../services/Camera';

import { Ionicons } from '@expo/vector-icons';

import { connect } from 'react-redux';

import ButtonPopover from './components/ButtonPopover';

import { Popover } from '../Popover';

import styles from './styles';
import { actions as mapActions } from '../../reducers/map';
import { actions as userActions } from '../../reducers/user';

class TabMiddleButton extends Component {
  static propTypes = {
    showPopover: PropTypes.bool,
    homePopoverDisplays: PropTypes.number,
    popoverMessage: PropTypes.string,
    togglePopover: PropTypes.func,
    setCachedLocation: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = { showPopover: props.showPopover };

    if (props.homePopoverDisplays === 0) {
      this.props.togglePopover();
      const timer = setTimeout(() => {
        this.setState({ showPopover: true });
        clearTimeout(timer);
      }, 1000);
    }
  }
  handlePress = () => {
    this.props.navigation.goBack();
    Camera.takePhotoAsync()
      .then(({ cancelled, uri }) => {
        if (cancelled) {
          return;
        }
        // this.props.setCachedLocation();
        this.props.navigation.navigate('CreateMarker', { photos: [uri] });
      })
      .catch(() => {});
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

const mapStateToProps = ({ map: { showPopover, homePopoverDisplays, popoverMessage } }) => {
  return {
    showPopover,
    homePopoverDisplays,
    popoverMessage,
  };
};

const mapDispatchToProps = {
  togglePopover: mapActions.togglePopover,
  setCachedLocation: userActions.setCachedLocation,
};
export default connect(mapStateToProps, mapDispatchToProps)(TabMiddleButton);
