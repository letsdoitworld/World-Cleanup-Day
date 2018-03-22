import i18n from 'i18next';
import Expo from 'expo';
import {handleSentryError} from '../shared/helpers';

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
        handleSentryError(ex)
        callback('en');
      }
    });
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n.use(languageDetector).init({
  fallbackLng: 'en',
  // have a common namespace used around the full app
  ns: ['general'],
  defaultNS: 'general',

  debug: false,

  // cache: {
  //   enabled: true
  // },

  interpolation: {
    // not needed for react as it does escape per default to prevent xss!
    escapeValue: false,
  },
});
// i18n.addResources('ach', 'general', require('../trans/ach.json'));
// i18n.addResources('af', 'general', require('../trans/af.json'));
// i18n.addResources('ar', 'general', require('../trans/ar.json'));
// i18n.addResources('ay', 'general', require('../trans/ay.json'));

i18n.addResources('be', 'general', require('../trans/be.json'));
// i18n.addResources('bg', 'general', require('../trans/bg.json'));
// i18n.addResources('bo', 'general', require('../trans/bo.json'));
// i18n.addResources('bs', 'general', require('../trans/bs.json'));

// i18n.addResources('ca', 'general', require('../trans/ca.json'));
i18n.addResources('ceb', 'general', require('../trans/ceb.json'));
// i18n.addResources('cs', 'general', require('../trans/cs.json'));
// i18n.addResources('csb', 'general', require('../trans/csb.json'));
// i18n.addResources('cy', 'general', require('../trans/cy.json'));

// i18n.addResources('da', 'general', require('../trans/da.json'));
// i18n.addResources('de', 'general', require('../trans/de.json'));

// i18n.addResources('ee', 'general', require('../trans/ee.json'));
i18n.addResources('el', 'general', require('../trans/el.json'));
i18n.addResources('en', 'general', require('../trans/en.json'));
i18n.addResources('es', 'general', require('../trans/es.json'));
i18n.addResources('et', 'general', require('../trans/et.json'));
// i18n.addResources('eu', 'general', require('../trans/eu.json'));

// i18n.addResources('fa', 'general', require('../trans/fa.json'));
// i18n.addResources('fi', 'general', require('../trans/fi.json'));
i18n.addResources('fil', 'general', require('../trans/fil.json'));
// i18n.addResources('fj', 'general', require('../trans/fj.json'));
i18n.addResources('fr', 'general', require('../trans/fr.json'));

// i18n.addResources('ga', 'general', require('../trans/ga.json'));
// i18n.addResources('gd', 'general', require('../trans/gd.json'));
// i18n.addResources('gl', 'general', require('../trans/gl.json'));

// i18n.addResources('ha', 'general', require('../trans/ha.json'));
// i18n.addResources('haw', 'general', require('../trans/haw.json'));
// i18n.addResources('he', 'general', require('../trans/he.json'));
i18n.addResources('hi', 'general', require('../trans/hi.json'));
// i18n.addResources('hmn', 'general', require('../trans/hmn.json'));
// i18n.addResources('hr', 'general', require('../trans/hr.json'));
// i18n.addResources('ht', 'general', require('../trans/ht.json'));
i18n.addResources('hu', 'general', require('../trans/hu.json'));
// i18n.addResources('hy', 'general', require('../trans/hy.json'));

// Android sends 'in' as language id for Indonesia (it should be id)
i18n.addResources('in', 'general', require('../trans/id.json'));
// i18n.addResources('ig', 'general', require('../trans/ig.json'));
// i18n.addResources('io', 'general', require('../trans/io.json'));
// i18n.addResources('is', 'general', require('../trans/is.json'));
i18n.addResources('it', 'general', require('../trans/it.json'));

// i18n.addResources('ja', 'general', require('../trans/ja.json'));
// i18n.addResources('jv', 'general', require('../trans/jv.json'));

// i18n.addResources('ka', 'general', require('../trans/ka.json'));
// i18n.addResources('kk', 'general', require('../trans/kk.json'));
// i18n.addResources('kl', 'general', require('../trans/kl.json'));
// i18n.addResources('km', 'general', require('../trans/km.json'));
// i18n.addResources('kn', 'general', require('../trans/kn.json'));
// i18n.addResources('ko', 'general', require('../trans/ko.json'));
// i18n.addResources('ku', 'general', require('../trans/ku.json'));
// i18n.addResources('ky', 'general', require('../trans/ky.json'));

// i18n.addResources('lg', 'general', require('../trans/lg.json'));
// i18n.addResources('lo', 'general', require('../trans/lo.json'));
i18n.addResources('lt', 'general', require('../trans/lt.json'));
// i18n.addResources('lv', 'general', require('../trans/lv.json'));

// i18n.addResources('mg', 'general', require('../trans/mg.json'));
// i18n.addResources('mi', 'general', require('../trans/mi.json'));
// i18n.addResources('mn', 'general', require('../trans/mn.json'));
// i18n.addResources('ms', 'general', require('../trans/ms.json'));
// i18n.addResources('mt', 'general', require('../trans/mt.json'));

// i18n.addResources('na', 'general', require('../trans/na.json'));
// i18n.addResources('ne', 'general', require('../trans/ne.json'));
i18n.addResources('nl', 'general', require('../trans/nl.json'));
// i18n.addResources('no', 'general', require('../trans/no.json'));

// i18n.addResources('pap', 'general', require('../trans/pap.json'));
// i18n.addResources('pcm', 'general', require('../trans/pcm.json'));
i18n.addResources('pl', 'general', require('../trans/pl.json'));
i18n.addResources('pt', 'general', require('../trans/pt.json'));

// i18n.addResources('qu', 'general', require('../trans/qu.json'));
// i18n.addResources('quc', 'general', require('../trans/quc.json'));

i18n.addResources('ro', 'general', require('../trans/ro.json'));
i18n.addResources('ru', 'general', require('../trans/ru.json'));
// i18n.addResources('rw', 'general', require('../trans/rw.json'));
// i18n.addResources('ry', 'general', require('../trans/ry.json'));

// i18n.addResources('sco', 'general', require('../trans/sco.json'));
// i18n.addResources('si', 'general', require('../trans/si.json'));
// i18n.addResources('sk', 'general', require('../trans/sk.json'));
i18n.addResources('sl', 'general', require('../trans/sl.json'));
// i18n.addResources('so', 'general', require('../trans/so.json'));
i18n.addResources('sq', 'general', require('../trans/sq.json'));
// i18n.addResources('sv', 'general', require('../trans/sv.json'));
// i18n.addResources('sw', 'general', require('../trans/sw.json'));

// i18n.addResources('ta', 'general', require('../trans/ta.json'));
// i18n.addResources('te', 'general', require('../trans/te.json'));
// i18n.addResources('tg', 'general', require('../trans/tg.json'));
// i18n.addResources('th', 'general', require('../trans/th.json'));
// i18n.addResources('tk', 'general', require('../trans/tk.json'));
i18n.addResources('tl', 'general', require('../trans/tl.json'));
// i18n.addResources('tn', 'general', require('../trans/tn.json'));
// i18n.addResources('tr', 'general', require('../trans/tr.json'));
// i18n.addResources('ty', 'general', require('../trans/ty.json'));

// i18n.addResources('ug', 'general', require('../trans/ug.json'));
i18n.addResources('uk', 'general', require('../trans/uk.json'));
// i18n.addResources('ur', 'general', require('../trans/ur.json'));

i18n.addResources('vi', 'general', require('../trans/vi.json'));
// i18n.addResources('vls', 'general', require('../trans/vls.json'));

// i18n.addResources('wo', 'general', require('../trans/wo.json'));

// i18n.addResources('xh', 'general', require('../trans/xh.json'));

// i18n.addResources('yi', 'general', require('../trans/yi.json'));
// i18n.addResources('yo', 'general', require('../trans/yo.json'));

i18n.addResources('zh', 'general', require('../trans/zh.json'));
// i18n.addResources('zu', 'general', require('../trans/zu.json'));
export default i18n;
