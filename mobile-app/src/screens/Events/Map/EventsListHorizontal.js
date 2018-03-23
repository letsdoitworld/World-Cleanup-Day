import React, {Component} from 'react';
import styles from "./styles";
import {
    View,
    Text,
    FlatList
} from 'react-native';
import ListItem from "../List/ListItem/ListItem";

export default class EventsListHorizontal extends Component {

    getEventsFromProps() {
        const { events } = this.props;
        return events;
    }

    keyExtractor = (item, index) => item.id.toString();

    renderItem = ({item}) => (

            <View>
                <Text>item.name</Text>
            </View>
    );

    render() {
        return (
            <View style={styles.list}>
                <FlatList
                    data={this.getEventsFromProps}
                    horizontal
                    keyExtractor={this.keyExtractor.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                />
            </View>
        );
    }

}