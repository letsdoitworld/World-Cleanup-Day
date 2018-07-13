import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import styles from './styles';
import {
  CleanedTrashpoint,
  RegularTrashpoint,
  RegularTrashpointInactive,
  ToxicTrashpoint,
} from '../../assets/images';
import location from '../../assets/images/ic_location.png';

const STATUS_IMAGES = {
  cleaned: CleanedTrashpoint,
  outdated: RegularTrashpointInactive,
  regular: RegularTrashpoint,
  threat: ToxicTrashpoint,
};

export default class TeamTrashpoints extends Component {
  keyExtractor = item => item.id;

  renderSeparator = () => {
    return (
      <View style={styles.listDivider} />
    );
  };

  renderTrashpointItem = ({ item }) => (
    <TouchableOpacity style={styles.trashpoint}>
      <Image source={STATUS_IMAGES[item.status]} />
      <Image source={location} style={styles.locationIcon} resizeMode="contain"/>
      <Text>{item.address}</Text>
    </TouchableOpacity>
  );

  renderTrashpointsList = trashpoints => (
    <FlatList
      data={trashpoints}
      renderItem={this.renderTrashpointItem}
      keyExtractor={this.keyExtractor}
      ItemSeparatorComponent={this.renderSeparator}
    />
  );


  render() {
    const { trashpoints } = this.props;
    return (
      <View>
        {this.renderTrashpointsList(trashpoints)}
      </View>
    );
  }
}
