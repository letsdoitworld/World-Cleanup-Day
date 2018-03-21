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
    FlatList, UIManager, LayoutAnimation
} from 'react-native';
import styles from './styles'
import strings from '../../assets/strings'
import ListItem from "./Item/ListItem";
import PropTypes from "prop-types";
import Profile from "../Profile/Profile";
import {isLoading} from "../../store/selectors";
import {
    ADD_TRASH_POINTS_MAP
} from "../index";

let _ = require('lodash');

const cancelId = 'cancelId';
const saveId = 'saveId';
const mapId = 'mapId';

const PAGE_SIZE = 20;

class AddTrashPoints extends Component {

    marked = new Map();

    static navigatorStyle = styles.navigatorStyle;

    static navigatorButtons = {
        leftButtons: [
            {
                icon: require('../../../src/assets/images/ic_back.png'),
                id: cancelId,
            }
        ]
    };

    page = 0;

    query = undefined;

    constructor(props) {
        super(props);

        props.selectedTrashPoints.forEach((trashPoint) => {
            this.marked.set(trashPoint.id, trashPoint)
        });

        this.state = {
            count: 0,
            trashPoints: []
        };

        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }


    componentDidMount() {
        const {onSearchTrashPointsAction} = this.props;
        onSearchTrashPointsAction(null, 0, PAGE_SIZE, this.props.location);
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
                case mapId: {
                    this.props.navigator.push({
                        screen: ADD_TRASH_POINTS_MAP,
                        title: strings.label_add_trashPoints,
                        passProps: {
                            location: this.props.location,
                            selectedTrashPoints: this.marked,
                            trashPoints: this.state.trashPoints,
                            onMapTrashPointsSaved: this.onMapTrashPointsSaved.bind(this)
                        }
                    });
                    break;
                }
            }
        }
    }

    onMapTrashPointsSaved(selectedTrashPoints) {
        this.marked = new Map();
        selectedTrashPoints.forEach((trashPoint) => {
            this.marked.set(trashPoint.id, trashPoint)
        });
        this.setState(previousState => {
            return {trashPoints: this.props.trashPoints}
        });
    }

    handleLoadMore = () => {
        if (this.getTrashPointsFromState().length < PAGE_SIZE * (this.page + 1)) {
            return
        }

        this.page++;

        const {onSearchTrashPointsAction} = this.props;
        onSearchTrashPointsAction(this.query, this.page, PAGE_SIZE, this.props.location);
    };

    componentWillReceiveProps(nextProps) {
        const receivedTrashPointsList = nextProps.trashPoints;

        if (receivedTrashPointsList === undefined) return;

        if (this.marked.size === 0) {
            this.setState(previousState => {
                return {trashPoints: receivedTrashPointsList}
            });
        } else {
            if (this.page === 0) {
                const filteredReceivedTrashPoints = receivedTrashPointsList
                    .filter((trashPoint) => !this.marked.has(trashPoint.id));

                if (filteredReceivedTrashPoints === undefined) return;

                const trashPoints = Array.from(this.marked.values()).concat(filteredReceivedTrashPoints);

                this.setState(previousState => {
                    return {trashPoints: trashPoints}
                });
            } else {
                this.setState(previousState => {
                    return {trashPoints: receivedTrashPointsList}
                });
            }
        }

        this.props.navigator.setButtons({
            leftButtons: [
                {
                    icon: require('../../../src/assets/images/ic_back.png'),
                    id: cancelId,
                }
            ],
            rightButtons: [
                {
                    title: strings.label_save,
                    id: saveId,
                    buttonColor: 'rgb(0, 143, 223)',
                    buttonFontSize: 17,
                    buttonFontFamily: 'Lato-Bold',
                },
                {
                    icon: require('../../../src/assets/images/icMapView.png'),
                    id: mapId,
                }
            ]
        })

    }

    getTrashPointsFromState() {
        return this.state.trashPoints;
    }

    onCheckedChanged(checked, item) {
        if (checked) {
            this.marked.set(item.id, item)
        } else {
            this.marked.delete(item.id)
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState(previousState => {
            return {
                ...previousState,
                count: this.marked.size
            };
        });
    };

    //noinspection JSMethodCanBeStatic
    render() {
        return (
            <View style={[styles.containerContent]}>
                <View style={[styles.mainContentContainer, styles.containerContent, styles.vertical]}>
                    {this.renderSearchBox()}
                    {this.renderCounter()}
                    <FlatList
                        ListFooterComponent={this.renderFooter.bind(this)}
                        ListHeaderComponent={this.renderHeader.bind(this)}
                        style={styles.list}
                        ItemSeparatorComponent={this.renderSeparator.bind(this)}
                        data={this.getTrashPointsFromState()}
                        keyExtractor={this.keyExtractor.bind(this)}
                        renderItem={this.renderItem.bind(this)}
                        onEndReached={this.handleLoadMore.bind(this)}
                        onEndReachedThreshold={0}
                    />
                </View>
                {this.renderProgress()}
            </View>
        );
    }

    renderCounter() {
        const count = this.state.count;
        if (count > 0) {
            return (
                <View style={{
                    width: '100%',
                    height: 30,
                    backgroundColor: 'rgb(0, 143, 223)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontFamily: 'Lato-Bold',
                        fontSize: 15,
                        color: 'white',
                    }}>
                        {strings.formatString(strings.trashPoints_counter, count)}
                    </Text>
                </View>
            );
        } else {
            return null;
        }
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
        const {onClearTrashPointsAction} = this.props;
        onClearTrashPointsAction();
    }

    isProgressEnabled() {
        return this.props.isLoading;
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

    keyExtractor = (item, index) => item.id.toString() + this.marked.has(item.id);

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
        const {onSearchTrashPointsAction} = this.props;

        onSearchTrashPointsAction(this.query, this.page, PAGE_SIZE, this.props.location);
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

Profile.propTypes = {
    trashPoints: PropTypes.object,
    isLoading: PropTypes.bool,
    onSearchTrashPointsAction: PropTypes.func,
    onClearTrashPointsAction: PropTypes.func,
};

export default AddTrashPoints