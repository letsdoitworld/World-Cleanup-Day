import React from 'react';
import { Image, View } from 'react-native';

const Icon = ({
  path,
  containerStyle,
  iconStyle,
}) => {
  return (
    <View style={containerStyle}>
      <Image source={path} style={iconStyle} />
    </View>
  );
};

Icon.propTypes = {
  ...Image.propTypes,
  path: Image.propTypes.source,
};

export { Icon };
