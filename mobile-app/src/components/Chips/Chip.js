import React, {Component} from 'react';
import {
    View,
    Dimensions,
    TouchableOpacity,
    Text,
    ScrollView,
    TextInput,
    Image,
    TouchableHighlight,
    ActivityIndicator,
    FlatList, UIManager, LayoutAnimation
} from 'react-native';
import strings from '../../assets/strings'
import {LEVEL} from "../TrashAmountLevel/TrashAmountLevel";
const {height, width} = Dimensions.get('window');

const style = {
    borderColor: 'rgb(0, 143, 223)',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 18,
    height: 30,
    borderRadius: 15,
    color: 'rgb(0, 143, 223)',
    fontFamily: 'Lato-Bold',
    fontSize: 15,
    lineHeight: 18,
    margin: 4
};

export default class Chip extends Component {

    render() {
        return (
            <Text style={style}>
                {this.props.text}
            </Text>
        )
    }

}