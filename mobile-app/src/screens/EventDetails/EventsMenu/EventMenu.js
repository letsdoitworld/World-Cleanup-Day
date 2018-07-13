import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text, Share, Platform } from 'react-native';
import branch from 'react-native-branch';

import { colors } from '../../../themes';
import styles from './styles';
import { navigatorStyle } from '../config';
import strings from '../../../assets/strings';
import { Badges } from '../../../assets/images';
import { AlertModal } from '../../../components/AlertModal';

class EventMenu extends PureComponent {
  static navigatorStyle = navigatorStyle
  constructor(props) {
    super(props);

    this.state = {
      showDeleteModal: false,
    };
  }

  closeMenu = () => {
    this.props.navigator.dismissModal();
  };

  toggleDeleteModal = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  }
  handleRenderButton() {
    const { event, profile } = this.props;

    if (!profile) return;

    if (event.createdBy === profile.id) {
      return (
        <TouchableOpacity onPress={this.toggleDeleteModal}>
          <View style={styles.itemContainer}>
            <Text style={[styles.text,
              { color: colors.black, fontFamily: 'Lato-Regular' }]}
            >
              {strings.label_delete_event}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
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
      $desktop_url: 'https://www.worldcleanupday.org/map-it/',
      $uri_redirect_mode: 2,
      type: 'event',
    };

    const { url } = await branchUniversalObject
      .generateShortUrl(linkProperties, controlParams);

    Share.share({
      message: Platform.OS === 'ios'
        ? strings.label_please_check_this_event
        : `${strings.label_please_check_this_event}\n${url}`,
      url,
      title: strings.label_sharing_event,
    }, {
      dialogTitle: strings.label_sharing_event,
      excludedActivityTypes: [
        'com.apple.UIKit.activity.PostToTwitter',
      ],
    }).then(() => {
      this.closeMenu();
    });
  }

  cancelButton = {
    text: strings.label_skip,
    onPress: this.toggleDeleteModal,
  };

  inviteButton = {
    text: strings.label_button_delete,
    onPress: async () => {
      await this.props.onDeleteEvent(this.props.event.id);
      this.toggleDeleteModal();
      this.props.onEventDeleted && await this.props.onEventDeleted();
      this.props.navigator.dismissAllModals();
    },
  };

  render() {
    return (
      <View style={styles.container}>
        <AlertModal
          visible={this.state.showDeleteModal}
          title={strings.label_delete_modal_title}
          subtitle={strings.label_delete_modal_subtitle}
          text={strings.label_delete_modal_text}
          image={Badges.delete}
          buttons={[this.cancelButton, this.inviteButton]}
          onOverlayPress={this.toggleDeleteModal}
          onPress={this.toggleDeleteModal}
        />
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
              Far far away, behind the word mountains, far from the countries.
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
          {this.handleRenderButton()}
        </View>
      </View>);
  }
}

export default EventMenu;
