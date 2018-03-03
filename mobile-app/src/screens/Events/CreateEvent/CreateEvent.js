import React, {Component} from 'react';
import {View, TouchableOpacity, Text, ScrollView, TextInput} from 'react-native';
import styles from './styles'
import strings from '../../../assets/strings'

export default class CreateEvent extends Component {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarTitleTextCentered: true,
    };
    // constructor(props) {
    //     super(props);
    //     this.state = {text: "Type short name of event"}
    // }

    render() {
        return (
            <View>
                <ScrollView style={styles.container}>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_title.toUpperCase()}</Text>
                    </View>
                    {/*<TextInput*/}
                        {/*onChangeText={}/>*/}


                </ScrollView>
            </View>)
    }

}