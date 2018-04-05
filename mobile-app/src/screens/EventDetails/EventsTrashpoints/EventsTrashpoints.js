import React, { PureComponent } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import toString from 'lodash/toString';
import isEmpty from 'lodash/isEmpty';

import strings from '../../../assets/strings';

import { Icons, Backgrounds } from '../../../assets/images';
import {
    Icon,
    Trashpoint,
} from '../../../components';

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
      <View style={styles.trashpointContainer}>
        <Trashpoint
          // type={trashpoint.type}
          location={trashpoint.name}
          onPress={this.handleTrashpointPress}
        />
        <TouchableOpacity
          onPress={this.handleTrashpointSelect}
        >
          <Icon path={Icons.BtnRemove} />
        </TouchableOpacity>
      </View>
    );
  }

  handleTrashpointSelect = () => console.log('Trashpoint select');

  handleTrashpointsPagination = () => console.log('Pagination');

  handleKeyExtractor = item => toString(item.id);

  handleRenderEmptyList() {
    return (
      <View style={styles.emptyTrashpointsContainer}>
        <Icon path={Backgrounds.EmptyTrashpoints} />
        <Text style={styles.textEmptyTrashpoint}>{strings.label_no_trashpoints}</Text>
      </View>
    );
  }

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
};

export default EventsTrshpoints;
