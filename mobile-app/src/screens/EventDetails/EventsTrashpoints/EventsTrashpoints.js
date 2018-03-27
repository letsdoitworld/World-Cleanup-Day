import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';

import moment from 'moment';

import toUpper from 'lodash/toUpper';

import strings from '../../../assets/strings';
import { Icons } from '../../../assets/images';
import {
    Icon,
    Map,
    ReadMore,
    Trashpoint,
} from '../../../components';

import { DEFAULT_ZOOM } from '../../../shared/constants';

import MainButton from '../../../components/Buttons/MainButton';

import styles from './styles';

import {
  navigatorStyle,
  navigatorButtons,
  backId,
} from './config';

class EventsTrshpoints extends PureComponent {

  static navigatorStyle = navigatorStyle;
  static navigatorButtons = navigatorButtons;

  constructor(props) {
    super(props);

    props.navigator.setOnNavigatorEvent(
        this.onNavigatorEvent,
    );
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

  handleRenderTrashpoint(trashpoint) {
    return (
      <Trashpoint
        // type={trashpoint.type}
        location={trashpoint.name}
        onPress={this.handleTrashpointPress}
      />
    );
  }

  handleTrashpointsPagination = () => console.log('Pagination')

  onRenderTrashPoints = () => {
    const { trashpoints } = this.props;
    return (
      <FlatList
        style={styles.tabContent}
        data={trashpoints}
        renderItem={({ item }) => this.handleRenderTrashpoint(item)}
        keyExtractor={this.handleKeyExtractor}
        onEndReachedThreshold={0.5}
        extraData={this.state}
        onEndReached={this.handleTrashpointsPagination}
      />
    );
  };

  render() {
    const { trashpoints } = this.props;

    console.log('PROPS!!!', this.props);
    return (
      <View
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text>Hello</Text>
        {this.onRenderTrashPoints()}
      </View>
    );
  }
}

EventsTrshpoints.propTypes = {
  event: PropTypes.object,
  error: PropTypes.object,
  eventId: PropTypes.string,
  navigator: PropTypes.object,
  onLoadEvent: PropTypes.func,
};

export default EventsTrshpoints;
