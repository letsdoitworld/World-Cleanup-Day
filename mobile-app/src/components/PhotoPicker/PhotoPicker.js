/* eslint-disable react/prefer-stateless-function,react/no-multi-comp */
import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

const PhotoComponent = ({ photo, onPress }) =>
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
          onPress={onPress}
        >
          <Image source={ButtonDelete} style={styles.deletePhotoButton} />
        </TouchableOpacity>
      </View>
    }
  </View>;

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
              ? () => onDeletePress(uri, index)
              : undefined;
            return (
              <PhotoComponent
                key={uri.url}
                photo={uri.url}
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
