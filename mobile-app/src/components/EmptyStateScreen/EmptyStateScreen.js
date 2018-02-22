import React from 'react';
import { Image, View, Text } from 'react-native';
import strings  from '../../assets/strings';
import styles from './styles';

export const EmptyStateScreen = ({ description, title}) => {
  return (
    <View style={styles.emptyStateContainer}>
      <Image
        source={require('./images/cat_300x300.png')}
        resizeMode="contain"
        style={styles.emptyStateImage}
      />
      <Text style={styles.emptyStateTitle}>
        {title || strings.label_text_activity_empty_subtitle}
      </Text>
      <Text style={styles.emptyStateDescription}>
        {description}
      </Text>
    </View>
  );
};
