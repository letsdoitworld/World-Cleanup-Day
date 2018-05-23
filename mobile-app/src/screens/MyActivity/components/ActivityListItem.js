import React from 'react';
import { TouchableHighlight, Text, View, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import {
  getWidthPercentage,
  getHeightPercentage,
} from '../../../shared/helpers';

export const STATUSES_COLOR = {
  threat: '#FE6669',
  regular: '#FF9900',
  outdated: '#E3E3E3',
  cleaned: '#7BEA4E',
};

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: getHeightPercentage(60),
    backgroundColor: '$white',
  },
  status: {
    width: getWidthPercentage(20),
    height: getWidthPercentage(20),
    borderRadius: 20,
  },
  name: {
    fontSize: '$fontDefaultSize',
    color: '$blue',
  },
  address: {
    fontSize: 11,
    color: '$textColor',
  },
  image: { height: getHeightPercentage(10) },
  textsContainer: { flex: 1 },
  marginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: getWidthPercentage(40),
  },
});

const ActivityListItem = ({
  id,
  name = 'Test name',
  address = '',
  status,
  location,
  counter = '',
  onPressItem,
  backgroundColor
}) => {
  const statusStyle = { backgroundColor: STATUSES_COLOR[status] };
  let nameToList = name.trim();
  let addressToList = address.trim();
  if (!nameToList || !addressToList) {
    const { longitude, latitude } = location;
    if (!nameToList) {
      nameToList = `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
    }
    if (!addressToList) {
      addressToList = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  }
  return (
    <TouchableHighlight
      onPress={() => onPressItem({ id, location })}
      activeOpacity={0.9}
    >
      <View style={[styles.container, {backgroundColor}]}>
        <View style={styles.marginContainer}>
          <View style={[styles.status, statusStyle]} />
        </View>
        <View style={styles.textsContainer}>
          <View style={{ paddingBottom: 2 }}>
            <Text style={styles.name}>
              {nameToList}
            </Text>
          </View>
          <View>
            <Text style={styles.address}>
              {addressToList}
            </Text>
          </View>
        </View>
        <View style={styles.marginContainer}>
          <Image
            style={styles.image}
            source={require('../../../assets/images/icon_menu_arrowforward.png')}
            resizeMode="contain"
          />
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default ActivityListItem;
