import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styles from './styles';

const SectionSeparator = ({ double }) => {
  return (
    <View>
      <View style={styles.firstLine} />
      {double && <View style={styles.secondLine} />}
    </View>
  );
};

SectionSeparator.defaultProps = {
  double: false,
};
SectionSeparator.propTypes = {
  double: PropTypes.bool,
};
export default SectionSeparator;
