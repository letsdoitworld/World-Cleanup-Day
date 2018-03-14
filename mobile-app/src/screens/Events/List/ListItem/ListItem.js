import React, {Component} from "react";
import {
    Image,
    Platform,
    Text,
    TouchableHighlight,
    View,
} from "react-native";
import styles from "./styles"
import strings from '../../../../assets/strings'

export default class ListItem extends Component {

    constructor(props) {
        super(props);

    }

    onPress = () => {
        console.log("Item press")
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
                style={item.participant ? styles.itemTouchParticipant : styles.itemTouch}>
                <View style={styles.itemContent}>
                    <Image
                        style={styles.image}
                        source={{uri: item.cover_picture}}/>
                    <View style={styles.titleContainer}>
                        <Text
                            numberOfLines={2}
                            style={styles.title}>
                            {item.title}
                        </Text>
                        <View style={styles.organizationRow}>
                            <Image
                                style={styles.organizationIcon}
                                source={require('./images/icGroupBlack24Px.png')}/>
                            <Text
                                numberOfLines={1}
                                style={styles.organizationText}>
                                {item.organization_name}
                            </Text>
                        </View>
                        <View style={styles.placeRow}>
                            <Image
                                resizeMode={'center'}
                                resizeMethod={'scale'}
                                style={styles.pin}
                                source={require('./images/icLocationOnBlack24Px.png')}/>
                            <Text
                                numberOfLines={1}
                                style={styles.placeText}>
                                {`${item.place.city}, ${item.place.country}`}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.statsContainer}>
                        <Text style={item.participant ? styles.availableParticipant : styles.available}>
                            {`${item.available}/${item.all}`}
                        </Text>
                        <Text style={styles.date}>
                            {item.date}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}