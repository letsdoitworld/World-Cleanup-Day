import * as Immutable from "../../../../node_modules/immutable/dist/immutable";
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
import styles from './styles'
import strings from '../../../assets/strings'
import ListItem from "./ListItem/ListItem";


export default class EventsList extends ImmutableComponent {

    page = 0;

    handleLoadMore = () => {
        if (this.getEventsListLength() < this.props.pageSize * (this.page + 1)) {
            return
        }

        this.page ++;

        this.props.onPageChanged(this.page)
    };

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    getEventsFromProps() {
        return this.props.events;
    }

    //noinspection JSMethodCanBeStatic
    render() {
        return (
            <FlatList
                ListFooterComponent={this.renderFooter.bind(this)}
                ListHeaderComponent={this.renderHeader.bind(this)}
                style={styles.list}
                ItemSeparatorComponent={this.renderSeparator.bind(this)}
                data={this.getEventsFromProps()}
                keyExtractor={this.keyExtractor.bind(this)}
                renderItem={this.renderItem.bind(this)}
                onEndReached={this.handleLoadMore.bind(this)}
                onEndReachedThreshold={3}
            />
        );
    }

    isProgressEnabled() {
        return this.props.isLoading;
    }

    renderSeparator = () => {
        return (
            <View style={styles.listDivider}/>
        )
    };

    getEventsListLength() {
        return this.getEventsFromProps() ? this.getEventsFromProps().length : 0
    }

    isEventsListEmpty() {
        return this.getEventsFromProps() ? this.getEventsFromProps().length === 0 : true;
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
            return <View style={styles.listDivider}/>
        }
    };

    renderHeader = () => {
        if (this.isProgressEnabled() && this.page === 0 || this.isEventsListEmpty()) {
            return null
        } else {
            return <View style={styles.listDivider}/>
        }
    };

    keyExtractor = (item, index) => item.id.toString();

    renderItem = ({item}) => (
        <ListItem
            navigator={this.props.navigator}
            item={item}
            id={item.id}/>
    );

    spinner() {
        return (
            <ActivityIndicator
                style={styles.spinner}
                size="large"
                color="rgb(0, 143, 223)"/>
        );
    }

}
