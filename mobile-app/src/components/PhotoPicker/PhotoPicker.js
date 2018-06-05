/* eslint-disable react/prefer-stateless-function,react/no-multi-comp */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import strings from '../../assets/strings';
import { ButtonDelete } from '../../assets/images';
import { AlertModal } from '../AlertModal';
import { LazyImage } from './components/LazyImage';
import styles from './styles';


class AddPhoto extends React.Component {
  render() {
    return (
      <View style={[styles.photo, styles.photoPlaceholder]}>
        <View style={styles.addImageCircle}>
          <TouchableOpacity
            style={styles.closeTouchAreaStyle}
            onPress={this.props.onPress}
          >
            <Text style={styles.imageClose}>
                    +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class PhotoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingConfirm: false,
    };

    this.buttons = [
      {
        text: strings.label_button_cancel,
        onPress: this.handleModalClosed,
      },
      {
        text: strings.label_button_delete,
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
      <View
        key={photo}
        style={[styles.photo]}
      >
        <LazyImage
          resizeMode="cover"
          style={[styles.photo]}
          source={{ uri: photo }}
        />
        {onPress &&
        <View style={styles.imageCircle}>
          <TouchableOpacity
            style={styles.closeTouchAreaStyle}
            onPress={this.handlePhotoDeletePress}
          >
            <Image source={ButtonDelete} style={styles.deletePhotoButton} />
          </TouchableOpacity>
        </View>
        }

        <AlertModal
          visible={showingConfirm}
          buttons={this.buttons}
          onOverlayPress={this.handleModalClosed}
          title={strings.label_delete_photo_title}
          subtitle={strings.label_delete_photo_subtitle}
        />
      </View>
    );
  }
}

export default class PhotoPicker extends React.Component {
  render() {
    const {
      maxPhotos,
      photos,
      onDeletePress,
      onAddPress,
    } = this.props;

    const hasAdd = !!onAddPress;
    const hasDelete = !!onDeletePress;
    const hasPhotos = !!photos;
    const couldAddMorePhotos =
          maxPhotos && hasPhotos && photos.length < maxPhotos;
    return (
      <View style={styles.container}>
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
  }
}
