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
//import {connect} from "react-redux";
import {
    searchEventsAction,
    clearEventsAction
} from '../../../store/actions/events'
 import ListItem from "./ListItem/ListItem";

const cancelId = 'cancelId';
const saveId = 'saveId';

const PAGE_SIZE = 15;

export default class EventsList extends ImmutableComponent {

   // marked = new Map();

   // static navigatorStyle = styles.navigatorStyle;

    page = 0;

    // static navigatorButtons = {
    //     leftButtons: [
    //         {
    //             icon: require('../../../src/assets/images/ic_back.png'),
    //             id: cancelId,
    //         }
    //     ],
    // };

    query = undefined;

    constructor(props) {
        super(props);
        this.state = {
            data: Immutable.Map({
                events: [],
            })
        };

        // props.selectedTrashPoints.forEach((trashPoint) => {
        //     this.marked.set(trashPoint.id, trashPoint)
        // });

       // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }


    componentDidMount() {
        this.props.dispatch(searchEventsAction(null, 0, PAGE_SIZE, this.props.location))
    }

    handleLoadMore = () => {
        if (this.getEventsFromState().length < PAGE_SIZE * (this.page + 1)) {
            return
        }

        this.page++;

        this.props.dispatch(searchEventsAction(this.query, this.page, PAGE_SIZE, this.props.location))
    };

    componentWillReceiveProps(nextProps) {
        const events = nextProps.events.get('events');

        if (events) {
            console.log("WIN");
            console.log(events.length);
        }

       // if (receivedTrashPointsList === undefined) return;

       // if (this.marked.size === 0) {
            this.setData(d => d.set('events', events));
       // } else {
        //
        //     const filteredReceivedTrashPoints = receivedTrashPointsList
        //         .filter((trashPoint) => !this.marked.has(trashPoint.id));
        //
        //     if (filteredReceivedTrashPoints === undefined) return;
        //
        //     const trashPoints = Array.from(this.marked.values()).concat(filteredReceivedTrashPoints);
        //
        //     this.setData(d => d.set('trashPoints', trashPoints));
        // }

    }

    getEventsFromState() {
        return this.state.data.get('events');
    }

    // onCheckedChanged(checked, item) {
    //     if (checked) {
    //         this.marked.set(item.id, item)
    //     } else {
    //         this.marked.delete(item.id)
    //     }
    // };

    //noinspection JSMethodCanBeStatic
    render() {
        return (
            <View style={[styles.containerContent, this.props.style]}>
                <View style={[styles.mainContentContainer, styles.containerContent, styles.vertical]}>
                    {/*{this.renderSearchBox()}*/}
                    <FlatList
                        // onLayout={this.onLayout.bind(this)}
                        // ListEmptyComponent={this.renderEmptyState.bind(this)}
                        ListFooterComponent={this.renderFooter.bind(this)}
                        ListHeaderComponent={this.renderHeader.bind(this)}
                        style={styles.list}
                        ItemSeparatorComponent={this.renderSeparator.bind(this)}
                        data={this.getEventsFromState()}
                        keyExtractor={this.keyExtractor.bind(this)}
                        renderItem={this.renderItem.bind(this)}
                        onEndReached={this.handleLoadMore.bind(this)}/>
                </View>
                {this.renderProgress()}
            </View>
        );
    }

    // renderSearchBox() {
    //     return (
    //         <View style={[styles.horizontal, styles.searchContainerStyle]}>
    //             <TextInput
    //                 placeholderTextColor={'rgb(41, 127, 202)'}
    //                 style={styles.searchField}
    //                 ref="input"
    //                 onChangeText={this.onQueryChange.bind(this)}
    //                 placeholder={strings.label_text_select_country_hint}
    //                 underlineColorAndroid={'transparent'}/>
    //         </View>
    //     );
    // };

    componentWillUnmount() {
        this.props.dispatch(clearEventsAction());
    }

    isProgressEnabled() {
        return this.props.app.get('progress');
    }

    renderSeparator = () => {
        return (
            <View style={styles.listDivider}/>
        )
    };

    renderFooter = () => {
        if (this.isProgressEnabled() && this.page === 0) {
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
        if (this.isProgressEnabled() && this.page === 0) {
            return null
        } else {
            return (<View style={styles.listDivider}/>)
        }
    };

    keyExtractor = (item, index) => item.id.toString();

    renderItem = ({item}) => (
        <View style={{
            width: '100%',
            height: 100,
            backgroundColor: 'red'
        }}
        />
    );


// <ListItem
// onCheckedChanged={this.onCheckedChanged.bind(this)}
// checked={this.marked.has(item.id)}
// navigator={this.props.navigator}
// item={item}
// id={item.id}/>

    // onQueryChange = debounce(function (text) {
    //     this.query = text;
    //     this.page = 0;
    //   //  this.props.dispatch(searchTrashPointsAction(this.query, this.page, PAGE_SIZE, this.props.location))
    // }, 1000);

    renderProgress() {
        if (this.isProgressEnabled() && this.page === 0) {
            return this.spinner()
        } else {
            return null;
        }
    }

    spinner() {
        return (
            <ActivityIndicator
                style={styles.spinner}
                size="large"
                color="rgb(0, 143, 223)"/>
        );
    }

}

// function debounce(func, wait, immediate) {
//     let timeout;
//     return function () {
//         let context = this, args = arguments;
//         let later = function () {
//             timeout = null;
//             if (!immediate) func.apply(context, args);
//         };
//         let callNow = immediate && !timeout;
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//         if (callNow) func.apply(context, args);
//     };
// }

// const mapStateToProps = (state) => ({
//     events: state.get('events'),
//     app: state.get('app'),
// });
//
// export default connect(mapStateToProps)(EventsList)