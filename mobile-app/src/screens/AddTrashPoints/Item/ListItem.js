import React, {Component} from "react";
import {
    Image,
    Platform,
    Text,
    TouchableHighlight,
    View,
} from "react-native";
import styles from "./styles"
import Checkbox from '../../../components/Checkbox/Checkbox'

export default class ListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {checked: props.checked};
    }

    onPress = () => {
        // this.props.navigator.push({
        //     screen: consts.DISCOVER_SCREEN,
        //     passProps: {
        //         school: this.props.item
        //     }
        // })
    };

    render() {

        const item = this.props.item;
        const checked = this.state.checked;

        const pin = checked ? require('../../../assets/images/icLocationSmall.png') : require('../../../assets/images/icLocationSmall.png');

        return (
            <TouchableHighlight
                underlayColor="rgb(232, 232, 232)"
                onPress={this.onPress.bind(this)}
                style={styles.itemTouch}>
                <View style={styles.itemContent}>
                    <Image
                        style={styles.status}
                        source={require('../../../assets/images/icCleanedTrashpoint.png')}/>
                    <Image
                        style={styles.pin}
                        resizeMode={'center'}
                        source={pin}/>
                    <Text
                        numberOfLines={1}
                        style={checked ? styles.title : styles.titleBlack}>
                        {item.title}
                    </Text>
                    <Checkbox
                        checked={checked}
                        onCheckedChanged={(checked) => {
                            this.setState(previousState => {
                                return { checked: checked };
                            });
                            this.props.onCheckedChanged(checked, item)
                        }}
                        style={styles.checkbox}/>
                </View>
            </TouchableHighlight>
        )
    }
}