import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import strings from '../../../../assets/strings'

import styles from './styles';

export const options = {
  urgent: {
    id: 'urgent',
    label: 'label_trash_status_urgent',
    image: require('./images/unselected/icToxicTrashpointSmall.png'),
    selectedImage: require('./images/selected/icToxicTrashpointSmall.png'),
    color: '#fc515e',
  },
  regular: {
    id: 'regular',
    label: 'label_trash_status_regular',
    image: require('./images/unselected/icRegularTrashpointCopy.png'),
    selectedImage: require('./images/selected/icRegularTrashpointCopy.png'),
    color: '#ff7a00',
  },
  cleaned: {
    id: 'cleaned',
    label: 'label_trash_status_cleaned',
    image: require('./images/selected/icRegularTrashpointCopy2.png'),
    selectedImage: require('./images/selected/icRegularTrashpointCopy2.png'),
    color: '#7BEA4E',
  },
};

export default class StatusPicker extends React.Component {
    render() {

        const {value, onChange} = this.props;

        const display = this.props.display
         ? this.props.display
            : ['urgent', 'regular'];

        return (
        <View style={styles.container}>
            {/*<Text style={styles.header}>*/}
                {/*{strings.label_text_createTP_status_subtitle}*/}
            {/*</Text>*/}
            {/*<Text style={styles.subHeader}>*/}
                {/*{strings.label_text_createTP_status_text}*/}
            {/*</Text>*/}
            <View style={styles.optionsContainer}>
                {display.map(prop => {
                    const option = options[prop];
                    const isSelected = value === option.id;
                    const onImagePress = () => onChange(option.id);
                    return (
                        <TouchableWithoutFeedback key={option.id} onPress={onImagePress}>
                            <View style={styles.option}>
                                <Image
                                    style={isSelected ? styles.selectedImage : styles.image}
                                    resizeMode="contain"
                                    source={isSelected ? option.selectedImage : option.image}
                                />
                                <Text style={[styles.imageText, isSelected ? { color: 'rgb(0, 143, 223)'} : {}]}>
                                    {strings[option.label].toUpperCase()}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </View>
        </View>
        );
    }
}
