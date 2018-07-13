import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import strings from '../../assets/strings';
import styles from './styles';

export const SaveButton = (props) => {
  return (
    <TouchableOpacity
      style={{
        height: '100%',
        justifyContent: 'center',
        borderWidth: 0,
        paddingRight: 45.5,
      }}
      onPress={props.onPress}
    >
      <View style={{
        width: 100,
        height: 25,
        flex: 1,
        marginRight: 50,
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
      >
        <Text style={styles.saveButtonText}>{strings.label_save}</Text>
      </View>
    </TouchableOpacity>
  );
};

