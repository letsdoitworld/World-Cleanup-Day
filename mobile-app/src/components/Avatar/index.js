import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import { Icons } from '../../assets/images';

import styles from './styles';

const Avatar = ({
    path,
}) => {
  const img = path ? path : Icons.PlaceHolderAvatar;

  return (
    <Image
      source={{ uri: img }}
      style={styles.avatar}
    />
  );
};

Avatar.propTypes = {
  path: PropTypes.string,
};

export { Avatar };
