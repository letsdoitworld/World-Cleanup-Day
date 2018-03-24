import React, {PureComponent, Component} from "react";
import {
    Image,
    Platform,
    Text,
    TouchableHighlight,
    View,
} from "react-native";
import styles from "./styles"
import Checkbox from '../../../components/Checkbox/Checkbox'
import strings from '../../../assets/strings'
import {TRASH_POINT} from "../../index";

export const STATUS_IMAGES = {
    cleaned: require('../../../assets/images/icCleanedTrashpoint.png'),
    outdated: require('../../../assets/images/icRegularTrashpointInactive.png'),
    regular: require('../../../assets/images/icRegularTrashpoint.png'),
    urgent: require('../../../assets/images/icToxicTrashpoint.png'),
};

export default class ListItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {checked: props.checked};
    }

    onPress() {
        this.props.navigator.push({
            screen: TRASH_POINT,
            title: strings.label_trashpoint,
            passProps: {
                onAddedPress: this.onAddedPress.bind(this),
                trashPoint: this.props.item
            }
        })
    };

    onAddedPress() {
        this.onCheckedChanged(true)
    };

    onCheckedChanged = (checked) => {
        this.setState(previousState => {
            return {checked: checked};
        });
        this.props.onCheckedChanged(checked, this.props.item)
    };

    render() {

        const item = this.props.item;
        const checked = this.state.checked;

        return renderItem(item, checked, this.props.style, this.onPress.bind(this), this.onCheckedChanged)
    }
}

export function renderItem(item, checked, style, onPress, onCheckedChanged) {
    return (
        <TouchableHighlight
            underlayColor="rgb(232, 232, 232)"
            onPress={onPress}
            style={[item.isIncluded ? styles.itemTouchIncluded : styles.itemTouch, style]}>
            <View style={styles.itemContent}>
                <Image
                    style={styles.status}
                    source={STATUS_IMAGES[item.status]}/>
                <Image
                    style={styles.pin}
                    resizeMode={'center'}
                    source={require('./images/icSmallLocationPinInactive.png')}/>
                <View style={styles.titleContainer}>
                    <Text
                        numberOfLines={1}
                        style={styles.titleBlack}>
                        {item.title}
                    </Text>
                    {
                        item.isIncluded ?
                            (
                                <Text
                                    numberOfLines={1}
                                    style={styles.includedText}>
                                    {strings.label_included_into_another_event}
                                </Text>
                            )
                            : null
                    }
                </View>
                {
                    !item.isIncluded ?
                        (
                            <Checkbox
                                checked={checked}
                                onCheckedChanged={(checked) => onCheckedChanged(checked, item)}
                                style={styles.checkbox}/>
                        )
                        : null
                }
            </View>
        </TouchableHighlight>
    )
}