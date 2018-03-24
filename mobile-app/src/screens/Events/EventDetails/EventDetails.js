import React, { Component } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import PropTypes from 'prop-types';

import toString from 'lodash/toString';
import isEqual from 'lodash/isEqual';

import strings from '../../../config/strings';
import { Icons } from '../../../assets/images';
import {
    Avatar,
    Icon,
    Divider,
    Tabs,
    Event,
    Trashpoint,
    Button,
} from '../../../components';

import styles from './styles';

import { navigatorStyle, navigatorButtons, backId } from './config';

class EventDetails extends Component {

  static navigatorStyle = navigatorStyle;
  static navigatorButtons = navigatorButtons;

  constructor(props) {
    super(props);

    props.navigator.setOnNavigatorEvent(
        this.onNavigatorEvent,
    );

    this.state = {
      visible: true,
    };
    
  }

  componentWillMount() {
    const { eventId, onLoadEvent } = this.props;

    onLoadEvent(eventId);
  }

  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
          case backId: {
              this.props.navigator.dismissModal();
              break;
            }
        }
    }
  }

  render() {
    const { error } = this.props;
//    if (error) return null;

    return (
      <View style={styles.container}>
        <Text>Hello Event detail!</Text>
      </View>
    );
  }
}

EventDetails.propTypes = {
  event: PropTypes.object,
  error: PropTypes.object,
  eventId: PropTypes.string,
  navigator: PropTypes.object,
  onLoadEvent: PropTypes.func,
};

export default EventDetails;
