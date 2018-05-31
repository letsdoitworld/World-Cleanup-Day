import React from 'react';
import {
  View,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';

import styles from './styles';

export default SearchBar = ({ onChangeText, value, placeholder, onPress }) =>
  <View style={styles.searchContainer}>
    <TextInput
      style={styles.searchInput}
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      maxLength={10}
      autoCorrect={false}
      underlineColorAndroid={'#fff'}
    />
    <TouchableOpacity style={styles.searchButton}
                      onPress={onPress}>
      <SimpleLineIcons name={'magnifier'} size={16} color={'#3E8EDE'}/>
    </TouchableOpacity>
  </View>;
