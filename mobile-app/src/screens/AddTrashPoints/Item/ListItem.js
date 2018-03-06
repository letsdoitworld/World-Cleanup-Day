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
        return (
            <TouchableHighlight
                underlayColor="rgb(232, 232, 232)"
                onPress={this.onPress.bind(this)}
                style={styles.itemTouch}>
                <View style={styles.itemContent}>

                    <Image
                        resizeMode={'center'}
                        style={styles.status}
                        source={require('../../../assets/images/icCleanedTrashpoint.png')}/>

                    <Image
                        resizeMode={'center'}
                        style={styles.pin}
                        source={require('../../../assets/images/icLocationPinActive.png')}/>

                    <Text
                        numberOfLines={1}
                        style={styles.title}>
                        {item.title}
                    </Text>

                    <Checkbox
                        style={styles.checkbox}>

                    </Checkbox>


                </View>


                {/*<View style={styles.imageContainer}>*/}
                    {/*<Thumbnail large style={styles.image} source={{uri: icon}}/>*/}
                {/*</View>*/}
                {/*<Text numberOfLines={1} style={styles.titleStyle}>{this.props.item.school_name}</Text>*/}
            </TouchableHighlight>
        )
    }
}