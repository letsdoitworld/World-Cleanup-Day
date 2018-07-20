/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text, Share, Platform } from 'react-native';
import branch from 'react-native-branch';

import { colors } from '../../../themes';
import strings from '../../../assets/strings';
import styles from './styles';
import { navigatorStyle } from '../config';


class TrashPointMenu extends PureComponent {
  static navigatorStyle = navigatorStyle
  closeMenu = () => {
    this.props.navigator.dismissModal();
  };
  pressShare = async () => {
    const { trashPoint, photo } = this.props;

    const description = trashPoint.composition[0];
    const branchUniversalObject = await branch
      .createBranchUniversalObject(trashPoint.id, {
        locallyIndex: true,
        title: trashPoint.name,
        contentDescription: description,
        contentImageUrl: photo,
        contentMetadata: {
          ratingAverage: 4.2,
          customMetadata: {
            type: 'trashpoint',
            name: trashPoint.name,
            address: trashPoint.address,
            amount: trashPoint.amount,
            areas: trashPoint.areas.join(),
            composition: trashPoint.composition.join(),
            counter: trashPoint.counter.toString(),
            createdAt: trashPoint.createdAt,
            createdBy: trashPoint.createdBy,
            creatorId: trashPoint.creator.id,
            creatorName: trashPoint.creator.name,
            creatorPictureURL: trashPoint.creator.pictureURL,
            datasetId: trashPoint.datasetId,
            hashtags: trashPoint.hashtags ? trashPoint.hashtags.join() : [],
            id: trashPoint.id,
            isIncluded: trashPoint.isIncluded ? trashPoint.isIncluded.toString() : 'true',
            latitude: trashPoint.location.latitude.toString(),
            longitude: trashPoint.location.longitude.toString(),
            photos: trashPoint.photos.join(),
            status: trashPoint.status,
            updatedAt: trashPoint.updatedAt,
            updatedBy: trashPoint.updatedBy,
            updaterId: trashPoint.updater.id,
            updaterName: trashPoint.updater.name,
            updaterPictureURL: trashPoint.updater.pictureURL,
          },
        },

      });

    const linkProperties = {
      feature: 'share',
      channel: 'RNApp',
    };

    const controlParams = {
      $desktop_url: 'https://www.worldcleanupday.org/map-it/',
      $uri_redirect_mode: 2,
    };

    const { url } = await branchUniversalObject
      .generateShortUrl(linkProperties, controlParams);

    const shareResult = await Share.share({
      message: Platform.OS === 'ios'
        ? strings.label_share_trashpoint
        : `${strings.label_share_trashpoint}\n${url}`,
      url,
      title: strings.label_share_trashpoint_title,
    }, {
      dialogTitle: strings.label_share_trashpoint_title,
      excludedActivityTypes: [
        'com.apple.UIKit.activity.PostToTwitter',
      ],
    });
    this.closeMenu();
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.closeMenu}>
          <View style={styles.cancelButton}>
            <Text style={[styles.text, { color: 'rgb(41, 127, 202)' }]} >
              {strings.label_button_cancel}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.buttonsContainer}>
          <View style={[styles.itemContainer,
            { borderBottomWidth: 0.5,
              borderBottomColor: 'rgb(228, 241, 253)' }]}
          >
            <Text style={
              {
                textAlign: 'center',
                color: 'rgba(40, 38, 51, 0.5)',
                fontFamily: 'Lato-Regular',
                fontSize: 12,
              }}
            >
              {strings.menu_sub_title}
            </Text>
          </View>
          <TouchableOpacity onPress={this.pressShare}>
            <View style={styles.itemContainer}>
              <Text style={[styles.text,
                { color: colors.black, fontFamily: 'Lato-Regular' }]}
              >
                {strings.label_share}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>);
  }
}

export default TrashPointMenu;
