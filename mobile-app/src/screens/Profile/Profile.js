import React, {Component} from 'react';
import {View, Text, FlatList, Alert} from 'react-native';
import PropTypes from 'prop-types';

import toString from 'lodash/toString';

import {SETTINGS_SCREEN} from '../index';
import strings from '../../config/strings';
import {Icons} from '../../assets/images';
import {
    Avatar,
    Icon,
    Divider,
    Tabs,
    Event,
    Trashpoint,
    Button,
} from '../../components';
import MyEventsList from './MyEventsAndTrashPoints/MyEventsList';

import styles from './styles';

import {navigatorStyle, navigatorButtons} from './config';

import {EVENTS, TRASHPOINTS} from './data';

const PAGE_SIZE = 15;

class Profile extends Component {

    static navigatorStyle = navigatorStyle;

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(
            this.onNavigatorEvent.bind(this),
        );

        this.state = {
            visible: true,
        };
    }

    componentDidMount() {
        const {isAuthenticated, isGuestSession, onFetchProfile, onLoadMyEvents, onLoadMyTrashPoints } = this.props;

        if (!isAuthenticated && isGuestSession) {
            this.props.navigator.setButtons({
                rightButtons: [],
                leftButtons: [
                    {
                        icon: Icons.Notification,
                        id: 'notification',
                    },
                ],
            })
        } else {
            onLoadMyEvents(15, 1);
            onFetchProfile();
            //onLoadMyTrashPoints(15, 1);
            this.props.navigator.setButtons({
                rightButtons: [
                    {
                        icon: Icons.Settings,
                        id: 'settings',
                    },
                ],
                leftButtons: [
                    {
                        icon: Icons.Notification,
                        id: 'notification',
                    },
                ],
            })
        }

    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

        if (event.id === 'willAppear') {
            this.setState({
                visible: true,
            });
        }
        if (event.id === 'willDisappear') {
            this.setState({
                visible: false,
            });
        }

        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'settings') {
                this.props.navigator.push({
                    screen: SETTINGS_SCREEN,
                    title: strings.label_settings_header,
                });
            }
        }
    }

    componentDidUpdate() {
        const { myEventsError, myTrashPointsError } = this.props;
        if ((myEventsError !== null && myEventsError !== undefined) && (myTrashPointsError === null && myTrashPointsError === undefined)) {
            this.showAlert(myEventsError)
        }
        if (myTrashPointsError !== null && myTrashPointsError !== undefined && (myEventsError === null && myEventsError === undefined)) {
            this.showAlert(myTrashPointsError)
        }
    }

    showAlert(error) {
        Alert.alert(
            'Error',
            error,
            [
                {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
            ],
        )
    }

    componentWillUnmount() {
        const { onLoadMyEventsError, onLoadMyTrashPointsError} = this.props;
        onLoadMyEventsError(null);
        onLoadMyTrashPointsError(null);
    }

    handleRenderLocation() {
        const {country} = this.props;

        if (country && country.name) {
            return (
                <View style={styles.locationContainer}>
                    <Icon path={Icons.Location}/>
                    <Text style={styles.locationText}>{country.name}</Text>
                </View>
            );
        }
    }

    handleRenderPhoneNumber() {
        return (
            <View>
                <View style={styles.additionalInfoContainer}>
                    <Icon path={Icons.Phone}/>
                    <Text style={styles.additionalInfoText}>+3809500000000</Text>
                </View>
                <Divider/>
            </View>
        );
    }

    handleRenderEmail() {
        const {profile} = this.props;

        if (profile && profile.email) {
            return (
                <View>
                    <View style={styles.additionalInfoContainer}>
                        <Icon path={Icons.Email}/>
                        <Text style={styles.additionalInfoText}>{profile.email}</Text>
                    </View>
                    <Divider/>
                </View>
            );
        }
    }

    // handleEventPress = () => {
    //     console.log('Event Press');
    // };

    handleTrashpointPress = () => {
        console.log('handleTrashpointPress');
    };

    // handleRenderEvents(event) {
    //     return (
    //         <Event
    //             img={event.photo}
    //             title={event.description}
    //             coordinator={event.coordinator}
    //             location={event.location}
    //             date={event.createDate}
    //             maxParticipants={event.maxPeople}
    //             participants={event.people}
    //             onPress={this.handleEventPress}
    //         />
    //     );
    // }

    handleRenderTrashpoint(trashpoint) {
        return (
            <Trashpoint
                type={trashpoint.type}
                location={trashpoint.location}
                onPress={this.handleTrashpointPress}
            />
        );
    }

    handleKeyExtractor = event => toString(event.id);

    loadMyEvents(page) {
        const {userCoord} = this.props;
        const {onSearchEventsAction} = this.props;
        onSearchEventsAction(this.query, page, PAGE_SIZE, userCoord);
    }

    onRenderEvents = () => {
        //console.warn("onRenderEvents", this.props.myEvents);
        return (
            <MyEventsList
                style={styles.tabContent}
                navigator={this.props.navigator}
                onPageChanged={this.loadMyEvents.bind(this)}
                myEvents={this.props.myEvents}
                pageSize={PAGE_SIZE}
            />
        );
    };

    onRenderTrashPoints = () => {
        const { myTrashPoints } = this.props;
        return (
            <FlatList
                style={styles.tabContent}
                data={myTrashPoints}
                renderItem={({item}) => this.handleRenderTrashpoint(item)}
                keyExtractor={this.handleKeyExtractor}
                onEndReachedThreshold={0.5}
                onEndReached={() => console.log('List end reached')}
            />
        );
    };


    handleRenderGuestProfile = () => {
        return (
            <View style={styles.guestContainer}>
                <View style={styles.imgPlaceholder}/>
                <Button
                    onPress={this.props.onGuestLogIn}
                    text="Log In"
                />
            </View>
        );
    };


    render() {
        const {isAuthenticated, isGuestSession, profile, myEvents} = this.props;
        //console.warn("Render ", myEvents);
        const {visible} = this.state;

        const scenes = {
            [strings.label_events]: this.onRenderEvents,
            [strings.label_trashpoints]: this.onRenderTrashPoints,
        };

        const routes = [
            {key: strings.label_events, title: strings.label_events},
            {key: strings.label_trashpoints, title: strings.label_trashpoints},
        ];

        if (!isAuthenticated && isGuestSession) return this.handleRenderGuestProfile();

        return (
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    <View style={styles.avatarContainer}>
                        <Avatar path={profile && profile.pictureURL}/>
                        <View style={styles.userNameContainer}>
                            <Text style={styles.userNameText}>{profile && profile.name}</Text>
                            {this.handleRenderLocation()}
                        </View>
                    </View>
                </View>
                <Divider/>
                {this.handleRenderPhoneNumber()}
                {this.handleRenderEmail()}
                <Tabs
                    events={myEvents}
                    scenes={scenes}
                    routes={routes}
                    isVisible={visible}
                />
            </View>
        );
    }
}

Profile.propTypes = {
    country: PropTypes.string,
    isAuthenticated: PropTypes.bool,
    isGuestSession: PropTypes.bool,
    profile: PropTypes.object,
    navigator: PropTypes.object,
    myEvents: PropTypes.object,
    myEventsError: PropTypes.object,
    myTrashPoints: PropTypes.object,
    myTrashPointsError: PropTypes.object,
    onFetchProfile: PropTypes.func,
    onGuestLogIn: PropTypes.func,
    onLoadMyEvents: PropTypes.func,
    onLoadMyTrashPoints: PropTypes.func,
    onLoadMyTrashPointsError: PropTypes.func,
    onLoadMyEventsError: PropTypes.func,
};

export default Profile;
