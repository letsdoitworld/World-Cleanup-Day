import i18n from 'i18next';
import Expo from 'expo';

const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: (callback) => {
    return Expo.Util.getCurrentLocaleAsync().then((lang) => {
      try {
        if (lang.indexOf('_')) {
          callback(lang.split('_')[0]);
        } else {
          callback(lang);
        }
      } catch (ex) {
        callback('en');
      }
    });
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n.use(languageDetector).init({
  fallbackLng: 'en',

  resources: {
    en: {
      login: {
        title: "Let's clean up the world together!",
      },
    },
    de: {
      login: {
        title: "Let's clean up the world together in german!",
      },
    },
  },

  // have a common namespace used around the full app
  ns: ['common'],
  defaultNS: 'common',

  debug: true,

  // cache: {
  //   enabled: true
  // },

  interpolation: {
    escapeValue: false, // not needed for react as it does escape per default to prevent xss!
  },
});

export default i18n;
