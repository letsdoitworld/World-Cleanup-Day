import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const Divider = ({ customStyles = {}, hasTopLine = true, hasBottomLine = true }) => {
  return (
    <View>
      {hasTopLine && <View style={[styles.container1, customStyles]} />}
      {hasBottomLine && <View style={[styles.containe2]} />}
    </View>
  );
};

Divider.propTypes = {
  customStyles: PropTypes.object,
  hasTopLine: PropTypes.bool,
  hasBottomLine: PropTypes.bool,
};

export { Divider };

