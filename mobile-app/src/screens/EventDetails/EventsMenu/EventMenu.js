import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import branch from 'react-native-branch';

import { colors } from '../../../themes';
import styles from './styles';
import { navigatorStyle } from '../config';

class EventMenu extends PureComponent {
  static navigatorStyle = navigatorStyle
  closeMenu = () => {
    this.props.navigator.dismissModal();
  }
  pressShare = async () => {
    const { event, photo } = this.props;
    const branchUniversalObject = await branch.createBranchUniversalObject(event.id, {
      locallyIndex: true,

      title: event.name,
      contentDescription: event.description,
      contentImageUrl: photo,
    });
    const linkProperties = {
      feature: 'share',
      channel: 'RNApp',
    };

    const controlParams = {
      $desktop_url: 'https://www.letsdoitworld.org',
      $uri_redirect_mode: 2,
      $og_site_name: 'cleanupworld.app.link',
      type: 'event',
    };

    const shareOptions = {
      messageHeader: 'Share event' };

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

export default EventMenu;
