import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import FAB from 'react-native-fab';
import Icon from 'react-native-vector-icons/Feather';

import styles from './styles';
import { CREATE_EVENT, EVENTS_NAV_BAR, SETTINGS_SCREEN } from '../index';
import strings from '../../assets/strings';


import EventsList from './List/List';
import { debounce } from '../../shared/util';

import EventsMap from '../EventMap/EventsMap';

const filterId = 'filterId';
const searchId = 'searchId';

const PAGE_SIZE = 10;

const MODE = {
  list: 0,
  map: 1,
};

class Events extends Component {

  previousError = undefined;

  constructor(props) {
    super(props);

    this.props.navigator.setStyle({
      navBarCustomView: EVENTS_NAV_BAR,
      statusBarColor: 'white',
      statusBarTextColorScheme: 'dark',
      navBarBackgroundColor: 'white',
      navBarCustomViewInitialProps: {
        handleIndexChange: this.onModeChanged.bind(this),
      },
    });

    this.state = {
      mode: MODE.list,
      isSearchFieldVisible: false,
    };

    this.closeValidationButton = {
      text: strings.label_button_acknowledge,
      onPress: this.handleSettingsPress,
    };

    this.successCancelButton = {
      text: strings.label_button_cancel,
      onPress: this.successCancel.bind(this),
    };

    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onModeChanged(index) {
    this.setState((previousState) => {
      return { mode: index };
    });
    this.props.navigator.setButtons({
      leftButtons: [
        {
          icon: require('../../../src/assets/images/icFilter.png'),
          id: filterId,
        },
      ],
      rightButtons: index === 1 ? [] : [
        {
          icon: require('../../../src/assets/images/icSearchBlack24Px.png'),
          id: searchId,
        },
      ],
    });
  }

  isSearchFieldVisible() {
    return this.state.isSearchFieldVisible;
  }

  toggleSearchFieldVisibility() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState((previousState) => {
      return { isSearchFieldVisible: !this.isSearchFieldVisible() };
    });
    if (!this.isSearchFieldVisible() && (this.query ? this.query.length > 0 : false)) {
      this.query = undefined;
      if (this.list) {
        this.list.page = 0;
      }
      this.loadEvents(0);
    }
  }

  query = undefined;

  static navigatorButtons = {
    leftButtons: [
      {
        icon: require('../../../src/assets/images/icFilter.png'),
        id: filterId,
      },
    ],
    rightButtons: [
      {
        icon: require('../../../src/assets/images/icSearchBlack24Px.png'),
        id: searchId,
      },
    ],

  };

  loadEvents(page) {
    const { userCoord } = this.props;
    const { onSearchEventsAction } = this.props;
    if (userCoord && userCoord !== null) {
      onSearchEventsAction(this.query, page, PAGE_SIZE, { latitude: userCoord.latitude, longitude: userCoord.longitude });
    } else {
      onSearchEventsAction(this.query, page, PAGE_SIZE);
    }
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case searchId: {
          this.toggleSearchFieldVisibility();
          break;
        }
      }
    }
  }

  handleSettingsPress = () => {
    this.props.navigator.push({
      screen: SETTINGS_SCREEN,
      title: strings.label_settings_header,
    });
  };

  handleFabPress = () => {
    const { isAuthenticated, isPrivateProfile } = this.props;

    if (isAuthenticated) {
      if (isPrivateProfile) {
        Alert.alert(
            strings.label_private_profile_wor_title,
                    strings.label_private_profile_wor,
          [
                       { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                       { text: 'Settings', onPress: this.handleSettingsPress },
          ],
                    { cancelable: false },
                );

        return;
      }
      this.props.navigator.showModal({
        screen: CREATE_EVENT,
        title: strings.label_create_events_step_one,
      });
    } else {
      Alert.alert(
          strings.label_private_auth_wor_title,
                strings.label_private_auth_wor,
        [
                    { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                    { text: 'Register', onPress: this.handleLogInPress },
        ],
            );
    }
  };

  successCancel() {
    this.props.navigator.pop()
  }

  renderContent(mapEvents) {
    switch (this.state.mode) {
      case MODE.list: {
        return (
          <EventsList
            onRef={ref => (this.list = ref)}
            navigator={this.props.navigator}
            onPageChanged={this.loadEvents.bind(this)}
            pageSize={PAGE_SIZE}
            isLoading={this.props.isLoading}
            events={this.props.events}
            emptyEvents={this.props.emptyEvents}
          />
        );
      }
      case MODE.map: {
        return (
          <EventsMap
            initialRegion={this.props.userCoord}
            mapEvents={mapEvents}
            navigator={this.props.navigator}
            onLoadMapEventsAction={this.props.onLoadMapEventsAction}
            datasetUUIDSelector={this.props.datasetUUIDSelector}
            onFetchDatasetUUIDAction={this.props.onFetchDatasetUUIDAction}
            onLoadEventsFromClusterAction={this.props.onLoadEventsFromClusterAction}
            delta={this.props.delta}
          />
        );
      }
      default:
        return null;
    }
  }

  handleLogInPress = () => {
    const { onGuestLogIn } = this.props;
    onGuestLogIn();
  };

  isProgressEnabled() {
    return this.props.isLoading;
  }

  renderProgress() {
    if (this.isProgressEnabled() && (this.list ? this.list.page === 0 : true)) {
      return this.spinner();
    }
    return null;
  }

  spinner() {
    return (
      <ActivityIndicator
        style={styles.spinner}
        size="large"
        color="rgb(0, 143, 223)"
      />
    );
  }

  showAlert(error) {
    Alert.alert(
      'Error',
      error,
      [
          { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      ],
    );
  }

  componentDidMount() {
    this.loadEvents(0);
  }

  componentWillUnmount() {
    const { onClearEventsAction } = this.props;
    onClearEventsAction();
  }

  renderSearchBox() {
    if (this.isSearchFieldVisible() && this.state.mode === 0) {
      return (
        <View style={[styles.horizontal, styles.searchContainerStyle]}>
          <TextInput
            placeholderTextColor={'rgb(41, 127, 202)'}
            style={styles.searchField}
            ref="input"
            onChangeText={this.onQueryChange.bind(this)}
            placeholder={strings.label_text_select_country_hint}
            underlineColorAndroid={'transparent'}
          />
        </View>
      );
    }
    return null;
  }

  onQueryChange = debounce(function (text) {
    this.query = text;
    if (this.list) {
      this.list.page = 0;
    }
    this.loadEvents(0);
  }, 1000);


  render() {
    const events = this.props.mapEvents;
    return (
      <View style={[styles.containerContent]}>
        <View style={[styles.mainContentContainer, styles.containerContent, styles.vertical]}>
          {this.renderSearchBox()}
          {this.renderContent(events)}
          <FAB
            buttonColor="rgb(225, 18, 131)"
            iconTextColor="white"
            onClickAction={this.handleFabPress.bind(this)}
            visible
            iconTextComponent={<Icon name="plus" />}
          />
        </View>
        {this.renderProgress()}
      </View>
    );
  }

}

Events.propTypes = {
  events: PropTypes.array,
  emptyEvents: PropTypes.array,
  mapEvents: PropTypes.array,
  isLoading: PropTypes.bool,
  userCoord: PropTypes.object,
  navigator: PropTypes.object,
  delta: PropTypes.array,
  error: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  datasetUUIDSelector: PropTypes.string,
  onSearchEventsAction: PropTypes.func,
  onClearEventsAction: PropTypes.func,
  onGuestLogIn: PropTypes.func,
  onLoadMapEventsAction: PropTypes.func,
  onFetchDatasetUUIDAction: PropTypes.func,
  onLoadEventsFromClusterAction: PropTypes.func,
};

export default Events;
