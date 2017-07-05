import React from 'react';
import PropTypes from 'prop-types';
import { Image, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ConfirmDelete } from './components/ConfirmDelete';

import styles from './styles';

const AddPhoto = ({ onPress }) => {
  return (
    <View style={[styles.photo, styles.photoPlaceholder]}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.photoButtonContainer, styles.photoButtonPlaceholder]}
      >
        <Ionicons size={styles.$photoSize} name="md-add" style={styles.photoButton} />
      </TouchableOpacity>
    </View>
  );
};
AddPhoto.propTypes = {
  onPress: PropTypes.func.isRequired,
};

// a caveat of this approach is that photo is a "leaf" component,
// and should not be responsible for holding the state
// but it's an easy start
// TODO lif the state up the screen component
// https://facebook.github.io/react/docs/lifting-state-up.html

class Photo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingConfirm: false,
    };
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
      <Image key={photo} style={[styles.photo]} source={{ uri: photo }}>
        {onPress &&
          <TouchableOpacity
            onPress={this.handlePhotoDeletePress}
            style={styles.photoButtonContainer}
          >
            <Ionicons size={styles.$photoSize} name="md-close" style={styles.photoButton} />
          </TouchableOpacity>}
        <Modal visible={showingConfirm} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <ConfirmDelete
              onCancel={this.handleModalClosed}
              onConfirm={this.handleModalConfirmed}
            />
          </View>

        </Modal>
      </Image>
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

const PhotoPicker = ({ photos, onDeletePress, onAddPress, maxPhotos = undefined }) => {
  const hasAdd = !!onAddPress;
  const hasDelete = !!onDeletePress;
  const couldAddMorePhotos = maxPhotos && photos.length < maxPhotos;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add trash photos</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.photoContainer}
        style={styles.photoContainer}
      >
        {photos.map((photo, index) => {
          const onDeletePhotoPress = hasDelete && (() => onDeletePress(index));
          return <Photo key={photo} photo={photo} onPress={onDeletePhotoPress} />;
        })}

        {hasAdd && couldAddMorePhotos && <AddPhoto key="add_photo" onPress={onAddPress} />}

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
export default PhotoPicker;
