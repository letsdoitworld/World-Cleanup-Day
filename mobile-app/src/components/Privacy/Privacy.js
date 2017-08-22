import React from 'react';
import { WebView } from 'react-native';
import styles from './styles';

import { PRIVACY_URL } from '../../../env';

const Privacy = ({ style = {} }) =>
  <WebView
    style={[styles.privacyView, style]}
    source={{
      uri: PRIVACY_URL,
    }}
  />;

export default Privacy;
