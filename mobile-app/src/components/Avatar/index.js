import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const Avatar = ({
    path,
}) => {
  const img = path ? { uri: path } : 'https://facebook.github.io/react-native/docs/assets/favicon.png';

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
