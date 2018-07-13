import React, { PureComponent } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

import toString from 'lodash/toString';
import isEmpty from 'lodash/isEmpty';

import strings from '../../../assets/strings';

import { Backgrounds, Icons } from '../../../assets/images';
import { Icon, Trashpoint } from '../../../components';

import styles from './styles';

import { backId, navigatorStyle } from './config';
import { TRASH_POINT } from '../../index';

class EventsTrshpoints extends PureComponent {
  static navigatorStyle = navigatorStyle;
  static navigatorButtons = {
    leftButtons: [
      {
        icon: Icons.Back,
        id: backId,
      },
    ],
  };

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
        default:
      }
    }
  };

  onRenderTrashPoints = () => {
    const { trashpoints } = this.props;

    if (!isEmpty(trashpoints)) {
      return (
        <FlatList
          data={trashpoints}
          renderItem={({ item }) => this.handleRenderTrashpoint(item)}
          keyExtractor={this.handleKeyExtractor}
          onEndReachedThreshold={0.5}
          onEndReached={this.handleTrashpointsPagination}
        />
      );
    }

    return this.handleRenderEmptyList();
  };

  handleRenderTrashpoint(trashpoint) {
    return (
      <View style={styles.trashpointContainer}>
        <Trashpoint
          type={trashpoint.status}
          location={trashpoint.name}
          onPress={() => this.handleTrashpointPress(trashpoint)}
        />
      </View>
    );
  }
  handleTrashpointSelect = () => console.log('Trashpoint select');

  handleTrashpointsPagination = () => console.log('Pagination');

  handleKeyExtractor = item => toString(item.id);

  handleTrashpointPress = (trashpoint) => {
    this.props.navigator.push({
      screen: TRASH_POINT,
      title: strings.label_trashpoint,
      passProps: {
        onCheckedChanged: false,
        trashPointId: trashpoint.id,
        trashPoint: trashpoint,
        isChecked: false,
        cancelTrashPointFromEvent: true,
      },
    });
  };
  handleRenderEmptyList() {
    return (
      <View style={styles.emptyTrashpointsContainer}>
        <Icon path={Backgrounds.EmptyTrashpoints} />
        <Text style={styles.textEmptyTrashpoint}>{strings.label_no_trashpoints}</Text>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.onRenderTrashPoints()}
      </View>
    );
  }
}

EventsTrshpoints.propTypes = {
  trashpoints: PropTypes.array,
  navigator: PropTypes.object,
  profile: PropTypes.object,
};

export default EventsTrshpoints;
