import ImmutableComponent from "../../../components/InputFields/ImmutableComponent";
import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    TextInput,
    Image,
    TouchableHighlight,
    ActivityIndicator,
    FlatList
} from 'react-native';
import {
    Avatar,
    Icon,
    Divider,
    Tabs,
    Event,
    Trashpoint,
    Button,
} from '../../../components';
import styles from './styles'

export default class MyEventsList extends ImmutableComponent {

    page = 0;

    handleLoadMore = () => {
        if (this.getMyEventsListLength() < this.props.pageSize * (this.page + 1)) {
            return
        }

        this.page ++;

        this.props.onPageChanged(this.page)
    };

    getMyEventsFromProps() {
        const { myEvents } = this.props;
        return myEvents;
    }

    handleEventPress = () => {
        console.log('Event Press');
    };

    //noinspection JSMethodCanBeStatic
    render() {
        return (
            <FlatList
                ListFooterComponent={this.renderFooter.bind(this)}
                ListHeaderComponent={this.renderHeader.bind(this)}
                style={styles.list}
                ItemSeparatorComponent={this.renderSeparator.bind(this)}
                data={this.getMyEventsFromProps()}
                keyExtractor={this.keyExtractor.bind(this)}
                renderItem={this.renderItem.bind(this)}
                onEndReachedThreshold={0}
                onEndReached={this.handleLoadMore.bind(this)}/>
        );
    }

    isProgressEnabled() {
        return false;
        //return this.props.app.get('progress');
    }

    renderSeparator = () => {
        return (<View style={styles.listDivider}/>)
    };

    getMyEventsListLength() {
        return this.getMyEventsFromProps() ? this.getMyEventsFromProps().length : 0
    }

    isEventsListEmpty() {
        return this.getMyEventsFromProps() ? this.getMyEventsFromProps().length === 0 : true;
    }

    renderFooter = () => {
        if (this.isProgressEnabled() && this.page === 0 || this.isEventsListEmpty()) {
            return null
        } else if (this.isProgressEnabled() && this.page > 0) {
            return (
                <View
                    style={styles.paginationFooter}>
                    {this.spinner()}
                </View>
            )
        } else {
            return (<View style={styles.listDivider}/>)
        }
    };

    renderHeader = () => {
        if (this.isProgressEnabled() && this.page === 0 || this.isEventsListEmpty()) {
            return null
        } else {
            return (<View style={styles.listDivider}/>)
        }
    };

    keyExtractor = (item, index) => item.id.toString();

    renderItem = ({event}) =>
        //console.warn("renderItem", event)
        <Event
            //img={event.photo}
            title={event.name}
            coordinator={''}
            location={''}
            date={''}
            maxParticipants={event.maxPeopleAmount}
            participants={''}
            onPress={this.handleEventPress}
        />;


    spinner() {
        return (
            <ActivityIndicator
                style={styles.spinner}
                size="large"
                color="rgb(0, 143, 223)"/>
        );
    }


}