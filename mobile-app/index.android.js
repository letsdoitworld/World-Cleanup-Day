import { AppRegistry } from 'react-native';
import App from './App';

import { Sentry } from 'react-native-sentry';

Sentry.config("https://7359efdb5fd44a2abd635949d9341044:2879ade97fde4b7c95cfaf4147258ef6@sentry.io/290369").install();

AppRegistry.registerComponent('mobileapp', () => App);
