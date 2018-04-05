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
import Chip from "./Chip";
const {height, width} = Dimensions.get('window');

const style = {
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10
};

export default class Chips extends Component {


    render() {
        return (
            <View style={style}>
                {this.renderChips()}
            </View>
        )
    }

    renderChips() {
        let key = 0;
        return this.props.types.map((type)=>
            <Chip
               text={type}
               key={key++}
            />
        )
    }
}