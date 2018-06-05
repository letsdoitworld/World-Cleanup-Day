import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import styles from './styles';
import strings from '../../assets/strings';

const openQURL = () => {
  Linking.openURL('https://www.qualitance.com/');
};
const openDUXURL = () => {
  Linking.openURL('http://dux.ee/');
};

export default class About extends Component {
    static navigatorStyle = {
      tabBarHidden: true,
      navBarTitleTextCentered: true,
    };

    render() {
      return (<View style={styles.container}>
        <Text style={styles.aboutText}>{strings.label_text_about_1}</Text>
        <Image
          style={styles.imgLdiLogo}
          resizeMode="contain"
          source={require('./images/ldilogo.png')}
        />
        <Text style={styles.aboutText}>{strings.label_text_about_2}</Text>
        <Image
          style={styles.imgWcdLogo}
          resizeMode="contain"
          source={require('./images/wcdlogo.png')}
        />
        <Text style={styles.aboutText}>{strings.label_text_about_3}</Text>

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
        <Text style={styles.aboutText}>{strings.label_text_about_4}</Text>
        <Text style={styles.aboutText}>{strings.label_text_about_5}</Text>
      </View>);
    }
}
