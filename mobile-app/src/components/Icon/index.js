import React from 'react';
import { Image } from 'react-native';

const Icon = ({
    path,
}) => {
  return (
    <Image source={path} />
  );
};

Icon.propTypes = {
  ...Image.propTypes,
  path: Image.propTypes.source,
};

export { Icon };
