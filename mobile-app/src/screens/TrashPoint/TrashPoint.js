import styles from './styles';
import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    TextInput,
    Image,
    TouchableHighlight,
    ActivityIndicator,
    FlatList, UIManager, LayoutAnimation, Dimensions,
} from 'react-native';
import { ADD_TRASH_POINTS_MAP } from '../index';
import strings from '../../assets/strings';
import { Map as MapView } from '../../components';
import { DEFAULT_ZOOM } from '../../shared/constants';
import TrashAmountLevel from '../../components/TrashAmountLevel/TrashAmountLevel';
import Chips from '../../components/Chips/Chips';
import Swiper from 'react-native-page-swiper';
import PageControl from 'react-native-page-control';

const { height, width } = Dimensions.get('window');

const cancelId = 'cancelId';

export const STATUS_IMAGES = {
  cleaned: require('../../assets/images/icCleanedTrashpoint.png'),
  outdated: require('../../assets/images/icRegularTrashpointInactive.png'),
  regular: require('../../assets/images/icRegularTrashpoint.png'),
  urgent: require('../../assets/images/icToxicTrashpoint.png'),
};

export const STATUS_LABEL = {
  cleaned: strings.label_cleaned_trashpoint,
  outdated: strings.label_outdated_trashpoint,
  regular: strings.label_regular_trashpoint,
  urgent: strings.label_urgent_trashpoint,
};

export const STATUS_COLOR = {
  cleaned: '#13bd73',
  outdated: '#999999',
  regular: '#ffa81c',
  urgent: '#e01280',
};

export default class CreateEvent extends Component {
  static navigatorStyle = styles.navigatorStyle;

  static navigatorButtons = {
      leftButtons: [
          {
            icon: require('../../../src/assets/images/icons/ic_back.png'),
            id: cancelId,
          },
        ],
    };

  constructor(props) {
      super(props);
      this.state = {
          index: 0,
        };

      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

  onNavigatorEvent(event) {
      if (event.type === 'NavBarButtonPress') {
          switch (event.id) {
              case cancelId: {
                  this.props.navigator.pop();
                  break;
                }
            }
        }
    }

  render() {
      const {
            place,
            status,
            creator,
            updater,
            createdAt,
            updatedAt,
            level,
            trashTypes,
        } = this.props.trashPoint;

      return (
          <View style={styles.container}>
              <ScrollView>
                  <MapView
                      markers={this.getMarker()}
                      initialRegion={this.getInitialRegion()}
                      region={this.getInitialRegion()}
                      style={styles.map}
                      getRef={map => this.map = map} 
                    />
                  <View style={styles.row}>
                      <Image source={require('./images/icTrashpointAddress.png')} />
                      <Text style={styles.textLabel}>
                          {`${place.house.toString()} ${place.street} ${place.city}`}
                        </Text>
                    </View>
                  <View style={styles.rowHeader}>
                      <Text style={styles.textHeader}>
                          {strings.label_type_of_trashpoint}
                        </Text>
                    </View>
                  <View style={styles.row}>
                      <Image
                          resizeMethod={'scale'}
                          resizeMode={'center'}
                          source={STATUS_IMAGES[status]}
                          style={styles.statusImage}
                        />
                      <Text style={[styles.textLabel, { color: STATUS_COLOR[status] }]}>
                          {STATUS_LABEL[status]}
                        </Text>
                    </View>
                  <View style={styles.rowHeader}>
                      <Text style={styles.textHeader}>
                          {strings.label_about_creator}
                        </Text>
                    </View>
                  <View style={styles.row}>
                      <Image
                          resizeMethod={'scale'}
                          resizeMode={'center'}
                          style={styles.avatar}
                          source={{ uri: creator.avatar }} 
                        />
                      <Text style={styles.textLabel}>
                          {`${creator.name} ${creator.lastname}`}
                        </Text>
                    </View>
                  <View style={[styles.row, { marginTop: 1 }]}>
                      <Image source={require('./images/icTime.png')} />
                      <Text style={styles.textLabel}>
                          {createdAt}
                        </Text>
                    </View>
                  <View style={styles.rowHeader}>
                      <Text style={styles.textHeader}>
                          {strings.label_last_update}
                        </Text>
                    </View>
                  <View style={styles.row}>
                      <Image
                          resizeMethod={'scale'}
                          resizeMode={'center'}
                          style={styles.avatar}
                          source={{ uri: updater.avatar }} 
                        />
                      <Text style={styles.textLabel}>
                          {`${updater.name} ${updater.lastname}`}
                        </Text>
                    </View>
                  <View style={[styles.row, { marginTop: 1 }]}>
                      <Image source={require('./images/icTime.png')} />
                      <Text style={styles.textLabel}>
                          {updatedAt}
                        </Text>
                    </View>
                  <View style={styles.rowHeader}>
                      <Text style={styles.textHeader}>
                          {strings.label_trash_amount}
                        </Text>
                    </View>
                  <TrashAmountLevel
                      level={level}
                      paddingHorizontal={20}
                    />
                  <View style={styles.rowHeader}>
                      <Text style={styles.textHeader}>
                          {strings.label_trash_type}
                        </Text>
                    </View>
                  <Chips types={trashTypes} />
                  <View style={styles.rowHeader}>
                      <Text style={styles.textHeader}>
                          {strings.label_photos}
                        </Text>
                    </View>
                  <Swiper
                      pager={false}
                      onPageChange={(index) => {
                          this.setState((previousState) => {
                              return {
                                  ...previousState,
                                  index,
                                };
                            });
                        }}
                      style={styles.swiper}
                    >
                      {this.renderPages()}
                    </Swiper>
                  <PageControl
                      style={styles.pageControlStyle}
                      numberOfPages={this.props.trashPoint.photos.length}
                      currentPage={this.state.index}
                      hidesForSinglePage
                      pageIndicatorTintColor="rgb(40, 38, 51)"
                      currentPageIndicatorTintColor={'rgb(63, 162, 247)'}
                      indicatorStyle={styles.dotStyle}
                      currentIndicatorStyle={styles.activeDotStyle}
                    />
                  <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={this.onSelectionConfirmed.bind(this)}
                    >
                      <Text style={styles.confirmButtonText}>
                          {strings.label_add_trashPoint}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

  onSelectionConfirmed() {
      this.props.onAddedPress();
      this.props.navigator.pop();
    }

  renderPages() {
      let key = 0;
      return this.props.trashPoint.photos.map(photo => this.renderPage(photo, key++));
    }

  renderPage(uri, key) {
      return (
          <TouchableOpacity
              key={key}
              onPress={this.onPhotoPress.bind(this)}
            >
              <Image
                  resizeMethod={'resize'}
                  resizeMode={'stretch'}
                  style={styles.photo}
                  source={{ uri }} 
                />
            </TouchableOpacity>
        );
    }

  onPhotoPress() {

    }

  getMarker() {
      const { trashPoint } = this.props;
      return [{
          id: trashPoint.id,
          latlng: trashPoint.location,
          status: trashPoint.status,
          item: trashPoint,
        }];
    }

  getInitialRegion() {
      const { trashPoint } = this.props;
      return {
          latitude: trashPoint.location.latitude,
          longitude: trashPoint.location.longitude,
          latitudeDelta: DEFAULT_ZOOM,
          longitudeDelta: DEFAULT_ZOOM,
        };
    }


}
