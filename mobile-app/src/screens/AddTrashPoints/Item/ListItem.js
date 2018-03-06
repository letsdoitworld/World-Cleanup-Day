import React, {Component} from "react";
import {Image, Platform, Text, TouchableOpacity, View} from "react-native";
import styles from "./styles"

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
        return (
            <TouchableOpacity onPress={this.onPress} style={styles.item}>
                {/*<View style={styles.imageContainer}>*/}
                    {/*<Thumbnail large style={styles.image} source={{uri: icon}}/>*/}
                {/*</View>*/}
                {/*<Text numberOfLines={1} style={styles.titleStyle}>{this.props.item.school_name}</Text>*/}
            </TouchableOpacity>
        )
    }
}