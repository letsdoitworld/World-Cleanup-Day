import React from 'react';
import {TouchableHighlight, Text, View, TouchableOpacity} from 'react-native';

import styles from './styles';
import strings from "../../assets/strings";

export const SimpleButton = ({onPress, text, textStyles = {}}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.confirmButton}
        >
            <Text style={styles.confirmButtonText}>
                {text}
            </Text>
        </TouchableOpacity>
    )
};

SimpleButton.defaultProps = {
    onPress: () => {
    }
};
