import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Tag from './Tag';
import styles from './styles';

const Tags = ({ tags, onTagSelect = _.noop, onTagDelete, tagCustomStyles }) => {
  return (
    <View style={styles.container}>
      {tags.map((tag, index) => {
        let onSelect = onTagSelect(index);
        let onDelete = undefined;
        if (onTagDelete) {
          onDelete = onTagDelete(index);
        }

        return (
          <Tag
            onSelect={onSelect}
            {...tag}
            key={index}
            onDelete={onDelete}
            customStyles={tagCustomStyles}
          />
        );
      })}
    </View>
  );
};

Tags.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      selected: PropTypes.bool,
    }),
  ),
  onTagSelect: PropTypes.func,
};

export default Tags;
