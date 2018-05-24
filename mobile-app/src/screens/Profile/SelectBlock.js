import React from 'react';
import { View, Image, Text, TouchableHighlight } from 'react-native';

import styles from './styles';

const renderTeamImage = (imageURL, imageLocal) => {
  return (
    <View style={styles.teamIconContainer}>
      {imageURL ?
        <Image
          source={{ uri: imageURL }}
          style={styles.teamIconImage}/> :
        <Image source={imageLocal} style={styles.teamIconImage}/>}
    </View>
  );
};

export default SelectBlock = ({ header, description, onPress, imageURL, imageLocal }) => (
  <TouchableHighlight onPress={onPress}
                      activeOpacity={0.7}
                      underlayColor="transparent">
    <View style={styles.teamContainer}>
      <View style={styles.teamIconContainer}>
        {renderTeamImage(imageURL, imageLocal)}
      </View>
      <View style={styles.teamContentContainer}>
        <View style={styles.teamTitleContainer}>
          <Text style={styles.teamTitle}>
            {header}
          </Text>
        </View>
        <View style={styles.teamNameContainer}>
          <Text style={styles.teamName}>
            {description}
          </Text>
        </View>
      </View>
      <View style={styles.teamChevronContainer}>
        <Image
          style={styles.teamChevron}
          source={require('../../assets/images/icon_menu_arrowforward.png')}
        />
      </View>
    </View>
  </TouchableHighlight>
);

