import React from 'react';
import { View,Text,Image } from 'react-native';
import styles from './styles';
import { translate } from 'react-i18next';


const About = ({t}) =>
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
  <Image
    style={styles.imgQualitanceLogo}
    resizeMode="contain"
    source={require('./images/qualitancelogo.png')}
  />
  <Image
    style={styles.imgDuxLogo}
    resizeMode="contain"
    source={require('./images/duxlogo.png')}
  />
  </View>
  </View>

export default translate()(About);
