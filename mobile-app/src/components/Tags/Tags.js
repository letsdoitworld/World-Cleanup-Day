/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Tag from './Tag';
import styles from './styles';

class Tags extends React.Component {
  render() {
    const {
      tags,
      onTagSelect = _.noop,
      onTagDelete,
      tagCustomStyles,
    } = this.props;

    return (
      <View style={styles.container}>
        {tags.map((tag, index) => {
          const onSelect = onTagSelect(index);
          let onDelete;
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
  }
}

Tags.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      selected: PropTypes.bool,
    }),
  ),
  onTagDelete: PropTypes.func,
  onTagSelect: PropTypes.func,
};

export default Tags;
