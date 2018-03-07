import * as Immutable from "../../../node_modules/immutable/dist/immutable";
import ImmutableComponent from "../../components/InputFields/ImmutableComponent";
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
import strings from '../../assets/strings'
import {connect} from "react-redux";

const cancelId = 'cancelId';
const saveId = 'saveId';

const PAGE_SIZE = 15;

import {
    searchTrashPointsAction,
    clearTrashPointsAction
} from '../../reducers/trashpoints/actions'
import ListItem from "./Item/ListItem";

class AddTrashPoints extends ImmutableComponent {

    marked = new Map();

    static navigatorStyle = styles.navigatorStyle;

    page = 0;

    static navigatorButtons = {
        leftButtons: [
            {
                icon: require('../../../src/assets/images/ic_back.png'),
                id: cancelId,
            }
        ],
    };

    query = undefined;

    constructor(props) {
        super(props);
        this.state = {
            data: Immutable.Map({
                //  isSearchEnabled: false,
                trashPoints: [],
                // heightOfFlatList: undefined,
            })
        };

        // const onTrashPointsSelected = props.onTrashPointsSelected;

        props.selectedTrashPoints.forEach((trashPoint) => {
            this.marked.set(trashPoint.id, trashPoint)
        });


        // const location = props.location;

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }


    componentDidMount() {
        this.props.dispatch(searchTrashPointsAction(null, 0, PAGE_SIZE, this.props.location))
    }

    componentDidUpdate() {

        const isDisabled = false;

        this.props.navigator.setButtons({
            rightButtons: [
                {
                    title: strings.label_save,
                    id: saveId,
                    buttonColor: 'rgb(0, 143, 223)',
                    buttonFontSize: 17,
                    buttonFontFamily: 'Lato-Bold',
                    disabled: isDisabled
                }
            ]
        })

    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            switch (event.id) {
                case cancelId: {
                    this.props.navigator.pop();
                    break;
                }
                case saveId: {
                    this.props.onTrashPointsSelected(this.marked);
                    this.props.navigator.pop();
                    break;
                }

            }
        }
    }

    // onLayout = ({nativeEvent: {layout: {height}},}) => {
    //     const heightOfFlatList = this.state.data.get('heightOfFlatList');
    //     if (heightOfFlatList === undefined || heightOfFlatList < height && this.isEmptyState()) {
    //         this.setData(d => d.set('heightOfFlatList', height));
    //     }
    // };

    handleLoadMore = () => {
        if (this.getTrashPointsFromState().length < PAGE_SIZE * (this.page + 1)) {
            return
        }

        this.page++;

        this.props.dispatch(searchTrashPointsAction(this.query, this.page, PAGE_SIZE, this.props.location))
    };

    componentWillReceiveProps(nextProps) {
        // if (
        //     this.getNotificationsFromState().length > 0
        //     &&
        //     this.refreshing
        //     &&
        //     this.page === 0
        //     &&
        //     nextProps.notifications.get('notifications').length > 0
        //     &&
        //     !nextProps.root.get('progress')) {
        //     this.refreshing = false
        // }


        const receivedTrashPointsList = nextProps.trashPoints.get('trashPoints');

        if (receivedTrashPointsList === undefined) return;

        if (this.marked.size === 0) {
            this.setData(d => d.set('trashPoints', receivedTrashPointsList));
        } else {

            const filteredReceivedTrashPoints = receivedTrashPointsList
                .filter((trashPoint) => !this.marked.has(trashPoint.id));

            if (filteredReceivedTrashPoints === undefined) return;

            const trashPoints = Array.from(this.marked.values()).concat(filteredReceivedTrashPoints);

            this.setData(d => d.set('trashPoints', trashPoints));
        }

    }

    getTrashPointsFromState() {
        return this.state.data.get('trashPoints');
    }

    onCheckedChanged(checked, item) {
        if (checked) {
            this.marked.set(item.id, item)
        } else {
            this.marked.delete(item.id)
        }
    };

    //noinspection JSMethodCanBeStatic
    render() {

        return (
            <View style={[styles.containerContent]}>
                <View style={[styles.mainContentContainer, styles.containerContent, styles.vertical]}>
                    {this.renderSearchBox()}
                    <FlatList
                        // onLayout={this.onLayout.bind(this)}
                        // ListEmptyComponent={this.renderEmptyState.bind(this)}
                        ListFooterComponent={this.renderFooter.bind(this)}
                        ListHeaderComponent={this.renderHeader.bind(this)}
                        style={styles.list}
                        ItemSeparatorComponent={this.renderSeparator.bind(this)}
                        data={this.getTrashPointsFromState()}
                        keyExtractor={this.keyExtractor.bind(this)}
                        renderItem={this.renderItem.bind(this)}
                        onEndReached={this.handleLoadMore.bind(this)}/>
                </View>
                {this.renderProgress()}
            </View>
        );
    }

    renderSearchBox() {
        return (
            <View style={[styles.horizontal, styles.searchContainerStyle]}>
                <TextInput
                    placeholderTextColor={'rgb(41, 127, 202)'}
                    style={styles.searchField}
                    ref="input"
                    onChangeText={this.onQueryChange.bind(this)}
                    placeholder={strings.label_text_select_country_hint}
                    underlineColorAndroid={'transparent'}/>
            </View>
        );
    };

    componentWillUnmount() {
        this.props.dispatch(clearTrashPointsAction());
    }

    isProgressEnabled() {
        return this.props.progress.get('progress');
    }

    //
    // renderCloseSearchIcon = () => {
    //     if (this.state.data.get('isSearchEnabled')) {
    //         return (
    //             <TouchableOpacity
    //                 onPress={this.onSearchClosePress.bind(this)}
    //                 style={searchAndAddSchoolStyle.closeContainerStyle}>
    //                 <Image
    //                     resizeMode={'center'}
    //                     source={require('../images/ic_cross/ic_cross_blue.png')}
    //                     style={searchAndAddSchoolStyle.closeSearchIconStyle}/>
    //             </TouchableOpacity>
    //         );
    //     } else {
    //         return null;
    //     }
    // };

    // onSearchClosePress = () => {
    //     this.refs.input.blur();
    //     this.refs.input.clear();
    //     this.query = undefined;
    //     this.setData(d => d.set('isSearchEnabled', false));
    //     this.page = 0;
    //     this.props.dispatch(schoolActions.getFollowedSchools(this.page, PAGE_SIZE))
    // };

    // onSearchFieldFocused = () => {
    //     this.page = 0;
    //     this.setData(d => d.set('isSearchEnabled', true));
    // };
    //
    // isEmptyState() {
    //     const schools = this.props.school.get('schools');
    //     return (schools === undefined || schools.length === 0) && (this.query === undefined || this.query.length === 0);
    // }

    // renderEmptyState = () => {
    //     if (this.props.root.get('progress')) {
    //         return null
    //     } else {
    //         return (
    //             <View style={searchAndAddSchoolStyle.emptySchools}>
    //                 <Image source={require('../images/ic_no_schools/iconSearchEmpty.png')}
    //                        style={searchAndAddSchoolStyle.imageEmptyStyle}/>
    //                 <Text style={searchAndAddSchoolStyle.emptyTextStyle}>{strings.no_schools}</Text>
    //             </View>
    //         )
    //     }
    // };


    renderSeparator = () => {
        return (
            <View style={styles.listDivider}/>
        )
    };
    //
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
        <ListItem
            onCheckedChanged={this.onCheckedChanged.bind(this)}
            checked={this.marked.has(item.id)}
            navigator={this.props.navigator}
            item={item}
            id={item.id}/>
    );


    onQueryChange = debounce(function (text) {
        this.query = text;
        this.page = 0;
        this.props.dispatch(searchTrashPointsAction(this.query, this.page, PAGE_SIZE, this.props.location))
    }, 1000);

    renderProgress() {
        if (this.isProgressEnabled() && this.page === 0) {
            return this.spinner()
        } else {
            return null;
        }
    }

    spinner() {
        return (
            <ActivityIndicator style={styles.spinner} size="large" color="rgb(0, 143, 223)"/>
        );
    }

}

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        let context = this, args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

const mapStateToProps = (state) => ({
    trashPoints: state.get('trashPoints'),
    progress: state.get('progress'),
});

export default connect(mapStateToProps)(AddTrashPoints)