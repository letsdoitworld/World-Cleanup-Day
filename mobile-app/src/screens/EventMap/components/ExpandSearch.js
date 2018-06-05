/* eslint-disable no-shadow,react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { expandSearch } from '../../../assets/images';


import styles from './styles';


const ExpandSearch = (props) => {
  return (
    <Modal
      onRequestClose={props.onPress}
      transparent
      visible={props.visible}
      animationType="fade"
    >
      <View style={styles.mainContainer}>
        <Image source={expandSearch} style={styles.image} />
        <Text style={styles.subHeader}>
            Nothing to see here!
        </Text>
        <Text style={styles.text}>
            Widen the search area or try another filter.
        </Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={props.onPress}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>
              Expand search area
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
ExpandSearch.defaultProps = {
  onPress: () => null,
  visible: true,
};
ExpandSearch.propTypes = {
  onPress: PropTypes.func,
  visible: PropTypes.bool,
};

export default ExpandSearch;
