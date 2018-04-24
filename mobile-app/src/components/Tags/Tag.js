import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Ionicons from "react-native-vector-icons/Ionicons";

import styles from './styles';

const Tag = ({label, selected, onSelect = _.noop, onDelete}) => {
    const tagContainerStyles = [styles.tagContainer];
    const textStyles = [styles.text];
    if (selected) {
        tagContainerStyles.push(styles.tagContainerSelected);
        textStyles.push(styles.textSelected);
    }
    if (onDelete) {
        tagContainerStyles.push({paddingRight: 35});
    }
    return (
        <TouchableHighlight onPress={onSelect} underlayColor="transparent">
            <View style={tagContainerStyles}>
                <Text style={textStyles}>
                    {label}
                </Text>
                {onDelete &&
                <TouchableHighlight
                    onPress={onDelete}
                    style={styles.hashtagTouchable}
                    underlayColor="transparent"
                >
                    <View style={styles.closeButton}>
                        <Ionicons
                            size={20}
                            name="md-close"
                            style={styles.closeStyle}
                        />
                    </View>
                </TouchableHighlight>
                }
            </View>
        </TouchableHighlight>
    );
};

Tag.propTypes = {
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    onDelete: PropTypes.func,
    customStyles: PropTypes.shape({
        container: PropTypes.any,
        text: PropTypes.any,
    }),
};

export default Tag;
