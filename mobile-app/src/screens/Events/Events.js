import React, {Component} from 'react';
import {
    View,
    TextInput,
    UIManager,
    Animation,
    LayoutAnimation,
    ActivityIndicator,
    Alert
} from 'react-native';
import styles from './styles'
import {
    CREATE_EVENT,
    EVENTS_NAV_BAR,
} from "../index";
import {connect} from "react-redux";
import strings from '../../assets/strings'
import FAB from 'react-native-fab'
import Icon from 'react-native-vector-icons/Feather';

import EventsList from "./List/List"
import {debounce} from "../../shared/util";
import * as Immutable from "../../../node_modules/immutable/dist/immutable";
import ImmutableComponent from "../../components/InputFields/ImmutableComponent";
import {DEFAULT_ZOOM} from "../../shared/constants";
import PropTypes from "prop-types";
import Profile from "../Profile/Profile";

const filterId = 'filterId';
const searchId = 'searchId';

const PAGE_SIZE = 15;

const MODE = {
    list: 0,
    map: 1
};

class Events extends Component {

    location = undefined;

    onModeChanged(index) {
        this.setState(previousState => {
            return {mode: index}
        });
    }

    isSearchFieldVisible() {
        return this.state.isSearchFieldVisible
    }

    toggleSearchFieldVisibility() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState(previousState => {
            return {isSearchFieldVisible: !this.isSearchFieldVisible()}
        });
        if (!this.isSearchFieldVisible() && (this.query ? this.query.length > 0 : false)) {
            this.query = undefined;
            if (this.list) {
                this.list.page = 0
            }
            this.loadEvents(0)
        }
    }

    query = undefined;

    static navigatorButtons = {
        leftButtons: [
            {
                icon: require('../../../src/assets/images/icFilter.png'),
                id: filterId,
            }
        ],
        rightButtons: [
            {
                icon: require('../../../src/assets/images/icSearchBlack24Px.png'),
                id: searchId,
            }
        ]

    };

    componentDidMount() {
        this.getCurrentPosition()
    }

    getCurrentPosition() {
        try {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.location = position.coords;
                    this.loadEvents(0)
                },
                (error) => {
                    this.loadEvents(0)
                }
            );
        } catch (e) {
            this.loadEvents(0)
        }
    };

    loadEvents(page) {
        const {onSearchEventsAction} = this.props;
        onSearchEventsAction(this.query, page, PAGE_SIZE, this.location);
    }

    constructor(props) {
        super(props);

        this.props.navigator.setStyle({
            navBarCustomView: EVENTS_NAV_BAR,
            statusBarColor: 'white',
            statusBarTextColorScheme: 'dark',
            navBarBackgroundColor: 'white',
            navBarCustomViewInitialProps: {
                handleIndexChange: this.onModeChanged.bind(this)
            }
        });

        this.state = {
            mode: MODE.list,
            isSearchFieldVisible: false,
        };
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            switch (event.id) {
                case filterId: {

                    break;
                }
                case searchId: {
                    this.toggleSearchFieldVisibility();
                    break;
                }
            }
        }
    }

    handleLogInPress = () => {
        const {onGuestLogIn} = this.props;
        onGuestLogIn()
    };

    handleFabPress = () => {
        const {isAuthenticated} = this.props;
        if (isAuthenticated) {
            this.props.navigator.showModal({
                screen: CREATE_EVENT,
                title: strings.label_create_events_step_one
            });
        } else {
            Alert.alert(
                'Oh no!',
                'You need to be a registrated user\n' +
                'in order to create events.',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'Register', onPress: this.handleLogInPress},
                ],
            )
        }

    };


    render() {
        return (
            <View style={[styles.containerContent]}>
                <View style={[styles.mainContentContainer, styles.containerContent, styles.vertical]}>
                    {this.renderSearchBox()}
                    {this.renderContent()}
                    <FAB
                        buttonColor="rgb(225, 18, 131)"
                        iconTextColor="white"
                        onClickAction={this.handleFabPress.bind(this)}
                        visible={true}
                        iconTextComponent={<Icon name="plus"/>}/>
                </View>
                {this.renderProgress()}
            </View>
        );
    }

    renderContent() {
        switch (this.state.mode) {
            case MODE.list: {
                return (
                    <EventsList
                        onRef={ref => (this.list = ref)}
                        navigator={this.props.navigator}
                        onPageChanged={this.loadEvents.bind(this)}
                        pageSize={PAGE_SIZE}
                        app={this.props.app}
                        events={this.props.events}/>
                );
            }
            case MODE.map: {
                return null;
            }
            default:
                return null;
        }
    }

    isProgressEnabled() {
        return false
        //return this.props.app.get('progress');
    }

    renderProgress() {
        if (this.isProgressEnabled() && (this.list ? this.list.page === 0 : true)) {
            return this.spinner();
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

    componentWillUnmount() {
        const {onClearEventsAction} = this.props;
        onClearEventsAction();
    }

    renderSearchBox() {
        if (this.isSearchFieldVisible()) {
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
        } else {
            return null;
        }
    };

    onQueryChange = debounce(function (text) {
        this.query = text;
        if (this.list) {
            this.list.page = 0
        }
        this.loadEvents(0)
    }, 1000);

}

Events.propTypes = {
    events: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    onSearchEventsAction: PropTypes.func,
    onClearEventsAction: PropTypes.func,
    onGuestLogIn: PropTypes.func,
};

export default (Events)