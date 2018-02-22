//
// import React, { Component } from 'react';
// import { Provider } from 'react-redux';
// import { AsyncStorage, Image, View } from 'react-native';
// import { compose } from 'recompose';
//
//
// import { MessageBar, MessageBarManager } from 'react-native-message-bar';
// import { persistStoreAsync } from './src/config/persist';
// import { withLocationGuard } from './src/services/Location';
// import { withNetworkGuard } from './src/services/Network';
// import { withErrorModal } from './src/services/Error/index';
// import { withCameraService } from './src/services/Camera';
// import store from './src/config/store';
// import Navigator from './src/config/routes';
// import { images, fonts } from './src/config/assets';
// import { operations as appOperations } from './src/reducers/app/index';
// import { handleSentryError } from './src/shared/helpers';
// import './src/config/styles';
//
// import { Api } from './src/services';
// import { API_URL, SENTRY_URL } from './env';
//
// // Remove this once Sentry is correctly setup.
// // Sentry.enableInExpoDevelopment = true;
//
// //Sentry.config(SENTRY_URL).install();
//
// const WrappedNavigator = () => {
//   return <Navigator screenProps={{ t: i18n.getFixedT() }} />;
// };
// // AsyncStorage.clear()
// const AppNavigator = compose(
//   translate('common', {
//     bindI18n: 'languageChanged',
//     bindStore: false,
//   }),
//   withNetworkGuard(),
//   withLocationGuard(),
//   withErrorModal(),
//   withCameraService(),
// )(WrappedNavigator);
//
// Api.setBaseURL(API_URL);
// export default class App extends Component {
//   constructor() {
//     super();
//
//     this.state = {
//       assetsLoaded: false,
//     };
//   }
//
//   componentWillMount() {
//     this.configAppAsync();
//   }
//
//   componentWillUnmount() {
//     MessageBarManager.unregisterMessageBar();
//   }
//
//   configAppAsync = async () => {
//     Promise.all([
//       Asset.loadAsync(images),
//       Font.loadAsync(fonts),
//       persistStoreAsync({
//         store,
//         storage: AsyncStorage,
//       }),
//       store.dispatch(appOperations.fetchDatasets()),
//     ]).then(
//       () => {
//         this.setState({ assetsLoaded: true });
//       },
//       (e) => {
//         handleSentryError(e);
//         console.log(e.message);
//       },
//     );
//   };
//   registerMessageBarRef = (a) => {
//     MessageBarManager.registerMessageBar(a);
//   };
//
//   render() {
//     if (this.state.assetsLoaded) {
//       return (
//         <Provider store={store}>
//           <I18nextProvider i18n={i18n}>
//             <View style={{ flex: 1 }}>
//               <AppNavigator />
//               <MessageBar ref={this.registerMessageBarRef} />
//             </View>
//           </I18nextProvider>
//         </Provider>
//       );
//     }
//     return <AppLoading/>;
//   }
// }
