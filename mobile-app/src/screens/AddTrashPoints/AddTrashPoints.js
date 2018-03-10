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
import {
    searchTrashPointsAction,
    clearTrashPointsAction
} from '../../store/actions/trashPoints'
import ListItem from "./Item/ListItem";

const cancelId = 'cancelId';
const saveId = 'saveId';

const PAGE_SIZE = 15;


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
                trashPoints: [],
            })
        };

        props.selectedTrashPoints.forEach((trashPoint) => {
            this.marked.set(trashPoint.id, trashPoint)
        });

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

    handleLoadMore = () => {
        if (this.getTrashPointsFromState().length < PAGE_SIZE * (this.page + 1)) {
            return
        }

        this.page++;

        this.props.dispatch(searchTrashPointsAction(this.query, this.page, PAGE_SIZE, this.props.location))
    };

    componentWillReceiveProps(nextProps) {
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
            <ActivityIndicator
                style={styles.spinner}
                size="large"
                color="rgb(0, 143, 223)"/>
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
    app: state.get('app'),
});

export default connect(mapStateToProps)(AddTrashPoints)