import React, {PureComponent} from 'react';
import {Image, Text, TouchableHighlight, View,} from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import strings from '../../../../assets/strings';
import {Backgrounds} from '../../../../assets/images';

import {EVENT_DETAILS_SCREEN} from '../../../index';
import moment from "moment/moment";

class ListItem extends PureComponent {

  onPress = () => {
    this.props.navigator.showModal({
      screen: EVENT_DETAILS_SCREEN,
      title: strings.label_event,
      passProps: {
        eventId: this.props.id,
        imageIndex: this.props.imageIndex,
      },
    });
  };

  selectImage = () => {
    const { imageIndex } = this.props;
    switch (imageIndex) {
      case 0: return Backgrounds.firstEmptyEvent;
      case 1: return Backgrounds.secondEmptyEvent;
      case 2: return Backgrounds.thirdEmptyEvent;
    }
  };

  render() {
    const { item, imageIndex } = this.props;
    const date = moment(item.startTime).format('DD.MM.YYYY');
    const bgImage = imageIndex === null ? { uri: item.photos[0] } : this.selectImage();
    return (
      <TouchableHighlight
        underlayColor="rgb(232, 232, 232)"
        onPress={this.onPress}
        style={item.participant ? styles.itemTouchParticipant : styles.itemTouch}
      >
        <View style={styles.itemContent}>
          <Image
            style={styles.image}
            source={bgImage}
          />
          <View style={styles.titleContainer}>
            <Text
              numberOfLines={2}
              style={styles.title}
            >
              {item.name}
            </Text>
            <View style={styles.organizationRow}>
              <Image
                style={styles.organizationIcon}
                source={require('./images/icGroupBlack24Px.png')}
              />
              <Text
                numberOfLines={1}
                style={styles.organizationText}
              >
                {item.description}
              </Text>
            </View>
            <View style={styles.placeRow}>
              <Image
                resizeMode={'center'}
                resizeMethod={'scale'}
                style={styles.pin}
                source={require('./images/icLocationOnBlack24Px.png')}
              />
              <Text
                numberOfLines={1}
                style={styles.placeText}
              >
                {item.address}
              </Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <Text style={item.participant
              ? styles.availableParticipant
              : styles.available}
            >
              {`${item.peopleAmount}/${item.maxPeopleAmount}`}
            </Text>
            <Text style={styles.date}>
                {moment(item.startTime).format('DD.MM.YYYY')}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

ListItem.propTypes = {
  item: PropTypes.object,
  imageIndex: PropTypes.number,
  id: PropTypes.string,
  navigator: PropTypes.object,
};

export default ListItem;
