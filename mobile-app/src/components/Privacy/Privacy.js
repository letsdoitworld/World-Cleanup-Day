/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { WebView } from 'react-native';
import { PRIVACY_URL } from 'react-native-dotenv';

import styles from './styles';

const Privacy = ({ style = {} }) =>
  <WebView
    style={[styles.privacyView, style]}
    source={{
      uri: PRIVACY_URL,
    }}
  />;

export default Privacy;
