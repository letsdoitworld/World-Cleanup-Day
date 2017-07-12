import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles';

const Item = ({ title, buttonText, onPress, optionSelected, imageStyles }) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container onPress={onPress} style={styles.container}>
      <Text>
        {title}
      </Text>
      <View style={styles.content}>
        <Text style={styles.optionText}>
          {optionSelected}
        </Text>
        <View style={styles.imageContainer}>
          <Image style={imageStyles} source={require('../../images/icon_ui_arrowdown.png')} />
        </View>
      </View>
    </Container>
  );
};

export default Item;
