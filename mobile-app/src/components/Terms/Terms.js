import React from 'react';
import { WebView, Linking } from 'react-native';
import styles from './styles';
import { TERMS_URL } from '../../../env';

class Terms extends React.Component {
  defaultProps = {
    style: {}
  };

  render() {
    return (
      <WebView
        style={[styles.termsView, this.props.style]}
        ref={ref => {
          this.webview = ref;
        }}
        source={{
          uri: TERMS_URL,
        }}
        onNavigationStateChange={event => {
          if (event.url !== TERMS_URL) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
    );
  }
}

export default Terms;
