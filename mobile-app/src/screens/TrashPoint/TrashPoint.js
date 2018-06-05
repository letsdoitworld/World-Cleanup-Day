
import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  UIManager,
} from 'react-native';
import Swiper from 'react-native-page-swiper';
import PageControl from 'react-native-page-control';
import PropTypes from 'prop-types';

import strings from '../../assets/strings';
import { Map as MapView } from '../../components';
import { DEFAULT_ZOOM } from '../../shared/constants';
import TrashAmountLevel from '../../components/TrashAmountLevel/TrashAmountLevel';
import Chips from '../../components/Chips/Chips';
import { TRASH_POINT_MENU_SCREEN } from '../index';
import Tags from '../../components/Tags/Tags';
import styles from './styles';
import { navigatorButtons, navigatorStyle, cancelId, menuId } from './config';

const moment = require('moment');

export const STATUS_IMAGES = {
  cleaned: require('../../assets/images/icCleanedTrashpoint.png'),
  outdated: require('../../assets/images/icRegularTrashpointInactive.png'),
  regular: require('../../assets/images/icRegularTrashpoint.png'),
  threat: require('../../assets/images/icToxicTrashpoint.png'),
};

export const STATUS_LABEL = {
  cleaned: strings.label_cleaned_trashpoint,
  outdated: strings.label_outdated_trashpoint,
  regular: strings.label_regular_trashpoint,
  threat: strings.label_urgent_trashpoint,
};

export const STATUS_COLOR = {
  cleaned: '#13bd73',
  outdated: '#999999',
  regular: '#ffa81c',
  threat: '#e01280',
};

export default class TrashPoint extends Component {
  static navigatorStyle = navigatorStyle;

  static navigatorButtons = navigatorButtons;

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };

    UIManager.setLayoutAnimationEnabledExperimental
      && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case cancelId: {
          // We need this for close modal when app open from social network link
          this.props.navigator.dismissAllModals();
          break;
        }
        case menuId: {
          this.props.navigator.showModal({
            screen: TRASH_POINT_MENU_SCREEN,
            title: 'Menu',
            navigatorStyle: {
              navBarHidden: true,
            },
            passProps: {
              trashPoint: this.props.trashPoint,
            },
          });
          break;
        }
        default:
      }
    }
  }

  onSelectionConfirmed() {
    this.props.onCheckedChanged(!this.props.isChecked);
    this.props.navigator.pop();
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

  renderPages() {
    let key = 0;

    return this.props.trashPoint.photos
      ? this.props.trashPoint.photos.map(photo => this.renderPage(photo, key++))
      : null;
  }

  renderPage(uri, key) {
    return (
      <TouchableOpacity
        key={key}
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

  render() {
    const {
      address,
      status,
      creator,
      updater,
      createdAt,
      updatedAt,
      amount,
      composition,
      isIncluded,
      hashtags,
      photos,
    } = this.props.trashPoint;
    console.log('Trashpoint photo ', hashtags);

    return (
      <View style={styles.container}>
        <ScrollView>
          <MapView
            markers={this.getMarker()}
            initialRegion={this.getInitialRegion()}
            region={this.getInitialRegion()}
            style={styles.map}
            getRef={(map) => { this.map = map; }}
          />
          <View style={styles.row}>
            <Image source={require('./images/icTrashpointAddress.png')} />
            <Text style={styles.textLabel}>
              {address}
            </Text>
          </View>
          {
            !isIncluded && this.props.onCheckedChanged
              ? <TouchableOpacity
                style={this.props.isChecked
                  ? [styles.confirmButton, { backgroundColor: 'rgb(225, 18, 131)' }]
                  : styles.confirmButton}
                onPress={this.onSelectionConfirmed.bind(this)}
              >
                <Text style={styles.confirmButtonText}>
                  {
                    this.props.isChecked
                      ? strings.label_remove_trashPoint
                      : strings.label_add_trashPoint
                  }
                </Text>
              </TouchableOpacity>
              : null
          }
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
              source={{ uri: creator ? creator.pictureURL : undefined }}
            />
            <Text style={styles.textLabel}>
              {creator ? creator.name : undefined}
            </Text>
          </View>
          <View style={[styles.row, { marginTop: 1 }]}>
            <Image source={require('./images/icTime.png')} />
            <Text style={styles.textLabel}>
              {moment(createdAt).format('DD.MM.YYYY')}
            </Text>
          </View>
          <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_TP_updates}
            </Text>
          </View>
          <View style={styles.row}>
            <Image
              resizeMethod={'scale'}
              resizeMode={'center'}
              style={styles.avatar}
              source={{ uri: updater ? updater.pictureURL : undefined }}
            />
            <Text style={styles.textLabel}>
              {updater ? updater.name : 'No updates'}
            </Text>
          </View>
          <View style={[styles.row, { marginTop: 1 }]}>
            <Image source={require('./images/icTime.png')} />
            <Text style={styles.textLabel}>
              {updatedAt ? moment(updatedAt).format('DD.MM.YYYY') : 'Time to contribute!'}
            </Text>
          </View>
          <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_trash_amount}
            </Text>
          </View>
          <TrashAmountLevel
            level={amount}
            paddingHorizontal={20}
          />
          {hashtags && hashtags.length > 0 &&
          <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_additional_tags}
            </Text>
          </View>
          }
          {hashtags && hashtags.length > 0 && <Tags tags={hashtags} />}
          <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_trash_type}
            </Text>
          </View>
          {composition && <Chips types={composition} />}
          <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_photos}
            </Text>
          </View>
          {
            photos &&
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
          }
          <PageControl
            style={styles.pageControlStyle}
            numberOfPages={photos ? photos.length : 0}
            currentPage={this.state.index}
            hidesForSinglePage
            pageIndicatorTintColor="rgb(40, 38, 51)"
            currentPageIndicatorTintColor={'rgb(63, 162, 247)'}
            indicatorStyle={styles.dotStyle}
            currentIndicatorStyle={styles.activeDotStyle}
          />
        </ScrollView>
      </View>
    );
  }
}

TrashPoint.propTypes = {
  trashPoint: PropTypes.object,
  navigator: PropTypes.object,
  isChecked: PropTypes.bool,
  onCheckedChanged: PropTypes.bool,
};
