import React, { Component } from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  TextInput,
  UIManager,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import FAB from 'react-native-fab';
import Icon from 'react-native-vector-icons/Feather';
import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';
import { CLIENT_ERRORS } from '../../shared/constants';
import { checkConnection } from '../../shared/helpers';
import styles from './styles';
import { CREATE_EVENT, NAV_BAR, SETTINGS_SCREEN } from '../index';
import strings from '../../assets/strings';
import { ButtonDelete } from '../../assets/images';
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
  constructor(props) {
    super(props);
    this.props.navigator.setStyle({
      navBarCustomView: NAV_BAR,
      statusBarColor: 'white',
      statusBarTextColorScheme: 'dark',
      navBarBackgroundColor: 'white',
      navBarHideOnScroll: false,
      navBarCustomViewInitialProps: {
        handleIndexChange: this.onModeChanged,
      },
    });
    this.redirectSettingsButton = {
      text: strings.label_settings_header,
      onPress: this.handleSettingsPress,
    };

    this.cancelButton = {
      text: strings.label_button_cancel,
      onPress: this.cancelPrivateDialog.bind(this),
    };

    this.registerButton = {
      text: strings.label_register,
      onPress: this.handleLogInPress.bind(this),
    };

    UIManager.setLayoutAnimationEnabledExperimental
      && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  state = {
    mode: MODE.list,
    isSearchFieldVisible: false,
    FABVisible: true,
    syncEvents: [],
    emptySyncEvents: [],
  };

  componentDidMount() {
    setTimeout(() => {
      this.loadEvents(0);
    }, 3000);
    setTimeout(() => {
      this.props.navigator.setStyle({
        navBarCustomView: NAV_BAR,
        navBarCustomViewInitialProps: {
          handleIndexChange: this.onModeChanged,
        },
      });
    }, 1000);
  }

  componentWillUnmount() {
    const { onClearEventsAction } = this.props;
    onClearEventsAction();
  }

  onModeChanged = (index) => {
    this.setState(() => {
      return { mode: index };
    });
    this.setState(() => {
      return { isSearchFieldVisible: false };
    });
    this.toggleSearchFieldVisibility();
    if (index === 0) {
      this.loadEvents(0);
    }
    if (index === 1) {
      this.props.navigator.setButtons({
        leftButtons: [
          {
            icon: require('../../../src/assets/images/icFilter.png'),
            id: filterId,
          },
        ],
        rightButtons: [],
      });
    }
  }

  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case searchId: {
          console.log('Search');
          this.toggleSearchFieldVisibility();
          break;
        }
        default:
      }
    }
  };

  onQueryChange = debounce((text) => {
    this.query = text;
    if (this.list) {
      this.list.page = 0;
    }
    this.loadEvents(0);
  }, 1000);

  onCleanQuery = debounce(() => {
    this.query = '';
    if (this.list) {
      this.list.page = 0;
    }
    this.loadEvents(0);
  }, 1000)
  onEventAdded = () => {
    this.list.page = 0;
    this.loadEvents(0);
  };
  previousError = undefined;
  query = '';

  loadEvents = (page) => {
    const { userCoord } = this.props;
    const { onSearchEventsAction } = this.props;
    if (userCoord && userCoord !== null) {
      onSearchEventsAction(this.query,
        page,
        PAGE_SIZE,
        { latitude: userCoord.latitude, longitude: userCoord.longitude },
      );
    } else {
      onSearchEventsAction(this.query, page, PAGE_SIZE);
    }
  };

  isProgressEnabled = () => {
    return this.props.isLoading;
  };

  isSearchFieldVisible = () => {
    return this.state.isSearchFieldVisible;
  };

  toggleSearchFieldVisibility = () => {
    switch (this.state.mode) {
      case MODE.list: {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState(() => {
          return { isSearchFieldVisible: !this.isSearchFieldVisible() };
        });
        if (!this.isSearchFieldVisible()
          && (this.query ? this.query.length > 0 : false)) {
          this.query = '';
          if (this.list) {
            this.list.page = 0;
          }
          this.loadEvents(0);
        }
        break;
      }
      default: break;
    }
  };

  successCancel = () => {
    this.props.navigator.pop();
  };

    handleLogInPress = () => {
      if (Platform.OS === 'android') {
        this.cancelPrivateDialog();
      }
      const { onGuestLogIn } = this.props;
      onGuestLogIn();
    };

  cancelPrivateDialog = () => {
    this.props.navigator.dismissModal();
    this.props.navigator.dismissLightBox();
  };

  showWarningDialog = (message, buttons) => {
    this.props.navigator.showLightBox({
      screen: 'ERROR_MODAL',
      passProps: {
        error: message,
        buttons,
      },
      style: {
        backgroundBlur: 'dark',
        tapBackgroundToDismiss: true,
      },
    });
  };

  handleFabPress = async () => {
    const { isAuthenticated, isPrivateProfile } = this.props;
    if (!await checkConnection()) {
      this.showWarningDialog(CLIENT_ERRORS.networkError, []);
      return;
    }
    if (isAuthenticated) {
      if (isPrivateProfile) {
        const buttons = [this.cancelButton, this.redirectSettingsButton];
        this.showWarningDialog(CLIENT_ERRORS.privacyError, buttons);
        return;
      }
      this.props.navigator.showModal({
        screen: CREATE_EVENT,
        title: strings.label_create_events_step_one,
        passProps: {
          onEventAdded: this.onEventAdded.bind(this),
        },
      });
    } else {
      const buttons = [this.cancelButton, this.registerButton];
      this.showWarningDialog(CLIENT_ERRORS.registerEventError, buttons);
    }
  };

  spinner = () => {
    return (
      <ActivityIndicator
        style={styles.spinner}
        size="large"
        color="rgb(0, 143, 223)"
      />
    );
  }
  synchronizeEvents = (events) => {
    const event = [];
    let empty = [];
    if (!isEmpty(events)) {
      events.map((ev) => {
        if (!has(ev, 'count')) {
          event.push(ev);
          return null;
        }
        return null;
      });
      empty = event.map((ev) => {
        if (!ev.photos[0]) return ev; return undefined;
      })
        .filter((e) => { return typeof e !== 'undefined'; });
    }
    this.setState({ syncEvents: event, emptySyncEvents: empty });
  }
  handleSettingsPress = () => {
    this.props.navigator.dismissModal();
    this.props.navigator.dismissLightBox();
    setTimeout(() => {
      this.props.navigator.push({
        screen: SETTINGS_SCREEN,
        title: strings.label_settings_header,
      });
    }, 500);
  };
  changeVisible = (state) => {
    this.setState({ FABVisible: state });
  }
  renderSearchBox() {
    if (this.isSearchFieldVisible()) {
      switch (this.state.mode) {
        case MODE.list: {
          return (
            <View style={[styles.horizontal, styles.searchContainerStyle]}>
              <TextInput
                placeholderTextColor="rgb(41, 127, 202)"
                style={styles.searchField}
                onChangeText={this.onQueryChange}
                placeholder={strings.label_text_select_country_hint}
                underlineColorAndroid="transparent"
              />
              {this.query !== '' && <TouchableOpacity onPress={this.onCleanQuery}>
                <Image source={ButtonDelete} style={styles.deleteButton} />
              </TouchableOpacity>}
            </View>
          );
        }
        default:
          return null;
      }
    }
    return null;
  }

  renderProgress = () => {
    if (this.isProgressEnabled() && (this.list ? this.list.page === 0 : true)) {
      return this.spinner();
    }
    return null;
  }
  renderContent = (mapEvents) => {
    switch (this.state.mode) {
      case MODE.list: {
        return (
          <EventsList
            onRef={(ref) => { this.list = ref; }}
            navigator={this.props.navigator}
            onPageChanged={this.loadEvents}
            pageSize={PAGE_SIZE}
            isLoading={this.props.isLoading}
            events={isEmpty(this.state.syncEvents)
              ? this.props.events
              : this.state.syncEvents}
            emptyEvents={isEmpty(this.state.emptySyncEvents)
              ? this.props.emptyEvents
              : this.state.emptySyncEvents}
            changeVisible={this.changeVisible}
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
            synchronizeEvents={this.synchronizeEvents}
            onFetchDatasetUUIDAction={this.props.onFetchDatasetUUIDAction}
            onLoadEventsFromClusterAction={this.props.onLoadEventsFromClusterAction}
            delta={this.props.delta}
            onRef={(ref) => { this.map = ref; }}
            isEmpty={this.props.isEmpty}
            searchVisible={this.state.isSearchFieldVisible}
          />
        );
      }
      default:
        return null;
    }
  }

  render() {
    const events = this.props.mapEvents;
    return (
      <View style={[styles.containerContent]}>
        <View
          style={[styles.mainContentContainer,
            styles.containerContent,
            styles.vertical]}
        >
          {this.renderSearchBox()}
          {this.renderContent(events)}
          <FAB
            buttonColor="rgb(225, 18, 131)"
            iconTextColor="white"
            onClickAction={this.handleFabPress}
            visible={this.state.FABVisible}
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
  isAuthenticated: PropTypes.bool,
  isPrivateProfile: PropTypes.bool,
  datasetUUIDSelector: PropTypes.string,
  onSearchEventsAction: PropTypes.func,
  onClearEventsAction: PropTypes.func,
  onLoadMapEventsAction: PropTypes.func,
  onFetchDatasetUUIDAction: PropTypes.func,
  onLoadEventsFromClusterAction: PropTypes.func,
  onGuestLogIn: PropTypes.func,
};

export default Events;
