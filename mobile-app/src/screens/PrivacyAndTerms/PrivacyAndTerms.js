import React from 'react';
import { WebView, Linking, View, StatusBar } from 'react-native';
import styles from './styles';

class PrivacyAndTerms extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent barStyle="dark-content" />
        <WebView
          style={styles.termsView}
          ref={(ref) => {
            this.webview = ref;
          }}
          source={{
            uri: this.props.uri,
          }}
          onNavigationStateChange={(event) => {
            if (event.url !== this.props.uri) {
              this.webview.stopLoading();
              Linking.openURL(event.url);
            }
          }}
        />
      </View>
    );
  }
}

export default PrivacyAndTerms;
