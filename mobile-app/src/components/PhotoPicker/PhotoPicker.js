import React from 'react';
import PropTypes from 'prop-types';
import { Image, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash';
import { translate } from 'react-i18next';

import { AlertModal } from '../AlertModal';
import { LazyImage } from './components/LazyImage';

import styles from './styles';

const AddPhoto = ({ onPress }) => {
  return (
    <View style={[styles.photo, styles.photoPlaceholder]}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.photoButtonContainer, styles.photoButtonPlaceholder]}
      >
        <Ionicons
          size={styles.$photoSize}
          name="md-add"
          style={styles.photoButton}
        />
      </TouchableOpacity>
    </View>
  );
};
AddPhoto.propTypes = {
  onPress: PropTypes.func.isRequired,
};

class Photo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingConfirm: false,
    };

    this.buttons = [
      {
        text: props.t('label_button_cancel'),
        onPress: this.handleModalClosed,
      },
      {
        text: props.t('label_button_delete'),
        onPress: this.handleModalConfirmed,
        style: styles.deleteButton,
      },
    ];
  }
  setConfirmState = (showingConfirm) => {
    this.setState({
      showingConfirm,
    });
  };
  handlePhotoDeletePress = () => {
    this.setConfirmState(true);
  };
  handleModalClosed = () => {
    this.setConfirmState(false);
  };
  handleModalConfirmed = () => {
    this.setConfirmState(false);
    this.props.onPress();
  };
  render() {
    const { photo, onPress } = this.props;
    const { showingConfirm } = this.state;
    return (
      <LazyImage key={photo} style={[styles.photo]} source={{ uri: photo }}>
        <View>
          {onPress &&
            <TouchableOpacity
              onPress={this.handlePhotoDeletePress}
              style={styles.photoButtonContainer}
            >
              <Ionicons
                size={styles.$photoSize}
                name="md-close"
                style={styles.photoButton}
              />
            </TouchableOpacity>}

          <AlertModal
            visible={showingConfirm}
            buttons={this.buttons}
            onOverlayPress={this.handleModalClosed}
            title={this.props.t('label_delete_photo_title')}
            subtitle={this.props.t('label_delete_photo_subtitle')}
          />
        </View>
      </LazyImage>
    );
  }
}
Photo.defaultProps = {
  onPress: undefined,
};
Photo.propTypes = {
  photo: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

const PhotoComponent = translate()(Photo);

const PhotoPicker = ({
  maxPhotos = undefined,
  title,
  photos,
  onDeletePress,
  onAddPress,
  t,
}) => {
  const hasAdd = !!onAddPress;
  const hasDelete = !!onDeletePress;
  const hasPhotos = !!photos;
  const couldAddMorePhotos =
    maxPhotos && hasPhotos && photos.length < maxPhotos;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title || t('label_text_createTP_add_photos')}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.photoContainer}
        style={styles.photoContainer}
      >
        {hasPhotos &&
          photos.map((uri, index) => {
            const onDeletePhotoPress = hasDelete
              ? () => onDeletePress(index)
              : undefined;
            return (
              <PhotoComponent
                key={uri}
                photo={uri}
                onPress={onDeletePhotoPress}
              />
            );
          })}

        {hasAdd &&
          couldAddMorePhotos &&
          <AddPhoto key="add_photo" onPress={onAddPress} />}

      </ScrollView>
    </View>
  );
};
PhotoPicker.defaultProps = {
  maxPhotos: undefined,
  onDeletePress: undefined,
  onAddPress: undefined,
};
PhotoPicker.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onDeletePress: PropTypes.func,
  onAddPress: PropTypes.func,
  maxPhotos: PropTypes.number,
};
export default translate()(PhotoPicker);
