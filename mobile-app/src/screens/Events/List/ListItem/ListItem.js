import React, { PureComponent } from 'react';
import {
    Image,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import styles from './styles';
import strings from '../../../../assets/strings';

import { EVENT_DETAILS_SCREEN } from '../../../index';

export default class ListItem extends PureComponent {

  onPress = () => {
      this.props.navigator.showModal({
          screen: EVENT_DETAILS_SCREEN,
          title: strings.label_event,
          passProps: {
              eventId: this.props.id,
            },
        });
    };

  render() {
      const { item } = this.props;

      return (
          <TouchableHighlight
              underlayColor="rgb(232, 232, 232)"
              onPress={this.onPress}
              style={item.participant ? styles.itemTouchParticipant : styles.itemTouch}
            >
              <View style={styles.itemContent}>
                  {   item.photos[0]
                      ? <Image
                          style={styles.image}
                          source={{uri: item.photos[0]}}/>
                      : <View style={[styles.image, {backgroundColor: 'grey'}]}/>
                  }
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
                                source={require('./images/icLocationOnBlack24Px.png')}/>
                            <Text
                                numberOfLines={1}
                                style={styles.placeText}>
                                {item.address}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.statsContainer}>
                        <Text style={item.participant ? styles.availableParticipant : styles.available}>
                            {`${item.peopleAmount}/${item.maxPeopleAmount}`}
                        </Text>
                      <Text style={styles.date}>
                          {item.date}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}
