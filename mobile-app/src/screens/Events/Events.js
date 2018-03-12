import React, {Component} from 'react';
import {View, TouchableOpacity, Text, TouchableHighlight, Button} from 'react-native';
import styles from './styles'
import {CREATE_EVENT} from "../index";
import strings from '../../assets/strings'

export default class Events extends Component {

    constructor(props) {
        super(props);
    }

    handleFabPress = () => {
        console.warn("Navigator", this.props.navigator);
        this.props.navigator.push.bind({
            screen: CREATE_EVENT,
            title: strings.label_create_events_step_one
        });
    };

    render() {
        return (
            <View>
                <View style={styles.container}>
                    <Button onPress={() => this.handleFabPress()}
                            title={"Create new event"}
                            style={styles.fabStyle}>
                    </Button>
                </View>
            </View>);
    }

}