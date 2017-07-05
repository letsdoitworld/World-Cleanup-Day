import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import styles from './styles';

const Tag = ({
  text,
  selected,
  onSelect = _.noop,
  onDelete
}) => {
  const tagContainerStyles = [styles.tagContainer];
  const textStyles = [styles.text];
  if (selected) {
    tagContainerStyles.push(styles.tagContainerSelected);
    textStyles.push(styles.textSelected);
  }
  if (onDelete) {
    tagContainerStyles.push(styles.tagHastag);
    textStyles.push(styles.tagText);
  }
  return (
    <TouchableHighlight onPress={onSelect} underlayColor="transparent">
      <View style={tagContainerStyles}>
        <Text style={textStyles}>
          {text}
        </Text>
        {onDelete &&
          <TouchableHighlight
            onPress={onDelete}
            style={styles.hashtagTouchable}
            underlayColor="transparent"
          >
            <View>
              <LinearGradient
                colors={['#4aa5ff', '#3ebede']}
                style={styles.linearGradient}
              >
                <Icon name="window-close" size={15} color="white" />
              </LinearGradient>
            </View>
          </TouchableHighlight>}
      </View>
    </TouchableHighlight>
  );
};

Tag.propTypes = {
  text: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  customStyles: PropTypes.shape({
    container: PropTypes.any,
    text: PropTypes.any,
  }),
};

export default Tag;
