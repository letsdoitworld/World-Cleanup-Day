import React from 'react';
import { Image, View, Text } from 'react-native';
import { translate } from 'react-i18next';
import styles from './styles';

const EmptyStateScreen = ({ description, title, t }) => {
  return (
    <View style={styles.emptyStateContainer}>
      <Image
        source={require('./images/cat_300x300.png')}
        resizeMode="contain"
        style={styles.emptyStateImage}
      />
      <Text style={styles.emptyStateTitle}>
        {title || t('label_text_activity_empty_subtitle')}
      </Text>
      <Text style={styles.emptyStateDescription}>
        {description}
      </Text>
    </View>
  );
};

export default translate()(EmptyStateScreen);
