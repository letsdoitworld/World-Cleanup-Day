import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import { Icons } from '../../assets/images';

import styles from './styles';

const Avatar = ({
  path,
}) => {
  const img = path ? { uri: path } : Icons.PlaceHolderAvatar;

  return (
    <Image
      source={img}
      style={styles.avatar}
    />
  );
};

Avatar.propTypes = {
  path: PropTypes.string,
};

export { Avatar };
