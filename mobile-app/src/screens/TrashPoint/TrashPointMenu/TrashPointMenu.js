import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import branch from 'react-native-branch';

import { colors } from '../../../themes';
import styles from './styles';
import { navigatorStyle } from '../config';

class TrashPointMenu extends PureComponent {
  static navigatorStyle = navigatorStyle
  closeMenu = () => {
    this.props.navigator.dismissModal();
  }
  pressShare = async () => {
    const { trashPoint } = this.props;
    const branchUniversalObject = await branch
      .createBranchUniversalObject(trashPoint.id, {
        locallyIndex: true,
        title: trashPoint.name,
        contentDescription: trashPoint.composition[0],
        contentImageUrl: trashPoint.photos[0],
        contentMetadata: {
          ratingAverage: 4.2,
          customMetadata: {
            type: 'trashpoint',
            name: trashPoint.name,
            address: trashPoint.address,
            amount: trashPoint.amount,
            areas: trashPoint.areas.join(),
            composition: trashPoint.composition.join(),
            coordinates: trashPoint.coordinates.join(),
            counter: trashPoint.counter.toString(),
            createdAt: trashPoint.createdAt,
            createdBy: trashPoint.createdBy,
            creatorId: trashPoint.creator.id,
            creatorName: trashPoint.creator.name,
            creatorPictureURL: trashPoint.creator.pictureURL,
            datasetId: trashPoint.datasetId,
            hashtags: trashPoint.hashtags.join(),
            id: trashPoint.id,
            isIncluded: trashPoint.isIncluded.toString(),
            isTrashpile: trashPoint.isTrashpile.toString(),
            latitude: trashPoint.location.latitude.toString(),
            longitude: trashPoint.location.longitude.toString(),
            photos: trashPoint.photos.join(),
            lat: trashPoint.position.lat.toString(),
            lng: trashPoint.position.lng.toString(),
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
      $desktop_url: 'https://www.letsdoitworld.org',
      $uri_redirect_mode: 2,
    };

    const shareOptions = {
      messageHeader: 'Share event',
      messageBody: `Help me with ${trashPoint.name}` };

    await branchUniversalObject
      .showShareSheet(shareOptions, linkProperties, controlParams);
    this.closeMenu();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.closeMenu}>
          <View style={styles.cancelButton}>
            <Text style={[styles.text, { color: 'rgb(41, 127, 202)' }]} >Cancel</Text>
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
              Far far away, behind the word mountains, far from the countries.
            </Text>
          </View>
          <TouchableOpacity onPress={this.pressShare}>
            <View style={styles.itemContainer}>
              <Text style={[styles.text,
                { color: colors.black, fontFamily: 'Lato-Regular' }]}
              >
                Share
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>);
  }
}

export default TrashPointMenu;
