import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import moment from 'moment';

import isNil from 'lodash/isNil';

import { Icon } from '../Icon';

import { Icons } from '../../assets/images';

import styles from './styles';

const Event = ({
  img,
  title,
  coordinator,
  address,
  location,
  date,
  maxParticipants,
  participants,
  onPress,
}) => {
  const photo = img ? { uri: img } : Icons.PlaceHolderAvatar;
  const handleRenderParticipants = () => {
    if (!isNil(maxParticipants) && !isNil(participants)) {
      return (
        <View style={styles.participantsContainer}>
          <Text>{participants}/{maxParticipants}</Text>
        </View>
      );
    }
  };

  const handleRenderCountry = () => {
    if (address) {
      return (
        <View style={styles.locationContainer}>
          <Icon path={Icons.Location} containerStyle={styles.icon} />
          <Text style={styles.locationText}>
            {address}
          </Text>
        </View>
      );
    }
  };

  const TouchableWrapper = onPress ? TouchableOpacity : View;

  return (
    <TouchableWrapper onPress={onPress} style={styles.container}>
      <Image source={photo} style={styles.image} />

      <View style={styles.middleColumn}>
        <Text style={styles.title}>{title}</Text>
        <View>
          {coordinator &&
            <View style={styles.coordinatorContainer}>
              <Icon path={Icons.GroupPeople} containerStyle={styles.icon} />
              <Text style={styles.coordinatorText}>{coordinator}</Text>
            </View>
          }
         
          {handleRenderCountry()}
        </View>
      </View>

      <View style={styles.rightColumn}>
        {handleRenderParticipants()}
        <Text style={styles.dateText}>
          {moment(date).format('DD.MM.YYYY')}
        </Text>
      </View>
    </TouchableWrapper>
  );
};

Event.propTypes = {
  img: PropTypes.number,
  title: PropTypes.string,
  coordinator: PropTypes.string,
  location: PropTypes.string,
  date: PropTypes.string,
  maxParticipants: PropTypes.number,
  participants: PropTypes.number,
  onPress: PropTypes.func,
};

export { Event };
