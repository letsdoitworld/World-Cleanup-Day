/* eslint-disable max-len,no-trailing-spaces */
import LocalizedStrings from 'react-native-localization';
import EN from './translations/en_US.json';
import BE from './translations/be_BY.json';
import CEB from './translations/ceb_PH.json';
import EL from './translations/el_GR.json';
import ES from './translations/es_ES.json';
import ET from './translations/et_EE.json';
import FIL from './translations/fil_PH.json';
import FO from './translations/fo_FO.json';
import HI from './translations/hi_IN.json';
import HU from './translations/hu_HU.json';
import ID from './translations/id_ID.json';
import IT from './translations/it_IT.json';
import JA from './translations/ja_JP.json';
import NL from './translations/nl_NL.json';
import NO from './translations/no_NO.json';
import PL from './translations/pl_PL.json';
import PT from './translations/pt_PT.json';
import PTB from './translations/pt_BR.json';
import RO from './translations/ro_RO.json';
import RU from './translations/ru_RU.json';
import SL from './translations/sl_SI.json';
import SQ from './translations/sq_AL.json';
import TL from './translations/tl_PH.json';
import TR from './translations/tr_TR.json';
import UK from './translations/uk_UA.json';
import VI from './translations/vi_VN.json';
import ZH from './translations/zh_CN.json';
import ZHT from './translations/zh_TW.json';

module.exports = new LocalizedStrings({
  en: EN,
  be: BE,
  ceb: CEB,
  el: EL,
  es: ES,
  et: ET,
  fil: FIL,
  fo: FO,
  hi: HI,
  hu: HU,
  id: ID,
  it: IT,
  ja: JA,
  nl: NL,
  no: NO,
  pl: PL,
  pt: PT,
  pt-BR: PTB,
  ro: RO,
  ru: RU,
  sl: SL,
  sq: SQ,
  tl: TL,
  tr: TR,
  uk: UK,
  vi: VI,
  zh: ZH, // just a fallback
  zh-Hans: ZH,
  zh-Hant: ZHT,
});
