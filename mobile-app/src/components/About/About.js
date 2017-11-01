import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import styles from './styles';
import { translate } from 'react-i18next';

const openQURL = () => {
  Linking.openURL('https://www.qualitance.com/');
};
const openDUXURL = () => {
  Linking.openURL('http://dux.ee/');
};

const About = ({ t }) =>
  <View style={styles.container}>
    <Text style={styles.aboutText}>{t('label_text_about_1')}</Text>
    <Image
      style={styles.imgLdiLogo}
      resizeMode="contain"
      source={require('./images/ldilogo.png')}
    />
    <Text style={styles.aboutText}>{t('label_text_about_2')}</Text>
    <Image
      style={styles.imgWcdLogo}
      resizeMode="contain"
      source={require('./images/wcdlogo.png')}
    />
    <Text style={styles.aboutText}>{t('label_text_about_3')}</Text>

    <View style={styles.flexContainer}>
      <TouchableOpacity onPress={openQURL}>
        <Image
          style={styles.imgQualitanceLogo}
          resizeMode="contain"
          source={require('./images/qualitancelogo.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={openDUXURL}>
        <Image
          style={styles.imgDuxLogo}
          resizeMode="contain"
          source={require('./images/duxlogo.png')}
        />
      </TouchableOpacity>
    </View>
    <Text style={styles.aboutText}>{t('label_text_about_4')}</Text>
    <Text style={styles.aboutText}>{t('label_text_about_5')}</Text>
  </View>;

export default translate()(About);
