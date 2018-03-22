import React, {Component} from 'react';
import styles from "../List/styles";
import {
    FlatList
} from 'react-native';
import ListItem from "../List/ListItem/ListItem";

export default class EventsListHorizontal extends Component {

    render() {
        return (
            <FlatList
                style={styles.list}
                ItemSeparatorComponent={this.renderSeparator.bind(this)}
                data={this.getEventsFromProps()}
                horizontal={true}
                keyExtractor={this.keyExtractor.bind(this)}
                renderItem={this.renderItem.bind(this)}
            />
        );
    }

    renderItem = ({item}) => (
        <ListItem
            navigator={this.props.navigator}
            item={item}
            id={item.id}/>
    );

}