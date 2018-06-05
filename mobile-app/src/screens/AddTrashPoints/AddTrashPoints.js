/* eslint-disable one-var,prefer-rest-params */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator,
  FlatList,
  LayoutAnimation,
  Text,
  TextInput,
  UIManager,
  View } from 'react-native';
import styles from './styles';
import strings from '../../assets/strings';
import ListItem from './Item/ListItem';
import { DEFAULT_ZOOM } from '../../shared/constants';
import { NAV_BAR } from '../index';
import { Icons } from '../../assets/images';
import TrashpointMap from './Map/AddTrashPointsMap';

const cancelId = 'cancelId';
const saveId = 'saveId';

const PAGE_SIZE = 20;
const MODE = {
  list: 0,
  map: 1,
};
class AddTrashPoints extends Component {
  static navigatorStyle = styles.navigatorStyle;

  static navigatorButtons = {
    leftButtons: [
      {
        icon: Icons.Back,
        id: cancelId,
      },
    ],
  };

  constructor(props) {
    super(props);

    props.selectedTrashPoints.forEach((trashPoint) => {
      this.marked.set(trashPoint.id, trashPoint);
    });
    this.initialRegion = {
      latitude: props.location.latitude,
      longitude: props.location.longitude,
      latitudeDelta: DEFAULT_ZOOM,
      longitudeDelta: DEFAULT_ZOOM,
    };
    this.state = {
      count: 0,
      trashPoints: [],
      mode: MODE.list,
      region: this.initialRegion,
    };

    UIManager.setLayoutAnimationEnabledExperimental
    && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }


  componentDidMount() {
    this.loadTrashpointsOnArea();
    if (!this.props.datasetUUIDSelector) {
      this.props.onFetchDatasetUUIDAction();
    }
  }


  componentWillReceiveProps(nextProps) {
    const receivedTrashPointsList = nextProps.mapTrashPoints
      .filter(mapTrashPoint => mapTrashPoint.count === undefined);

    if (receivedTrashPointsList === undefined) return;


    if (this.marked.size === 0) {
      this.setState(() => {
        return {
          trashPoints: receivedTrashPointsList,
          count: this.marked.size,
        };
      });
    } else if (this.page === 0) {
      const filteredReceivedTrashPoints = receivedTrashPointsList
        .filter(trashPoint => !this.marked.has(trashPoint.id));

      if (filteredReceivedTrashPoints === undefined) return;

      const trashPoints = Array.from(this.marked.values())
        .concat(filteredReceivedTrashPoints);

      this.setState(() => {
        return {
          trashPoints,
          count: this.marked.size,
        };
      });
    } else {
      this.setState(() => {
        return {
          trashPoints: receivedTrashPointsList,
          count: this.marked.size,
        };
      });
    }
    this.props.navigator.setStyle({
      navBarCustomView: NAV_BAR,
      statusBarColor: 'white',
      statusBarTextColorScheme: 'dark',
      navBarBackgroundColor: 'white',
      navBarCustomViewInitialProps: {
        handleIndexChange: this.onModeChanged.bind(this),
      },
    });
    this.props.navigator.setButtons({
      leftButtons: [
        {
          icon: Icons.Back,
          id: cancelId,
        },
      ],
      rightButtons: [
        {
          title: strings.label_save,
          id: saveId,
          buttonColor: 'rgb(0, 143, 223)',
          buttonFontSize: 17,
          buttonFontFamily: 'Lato-Bold',
        },
      ],
    });
  }

  componentWillUnmount() {
    const { onClearTrashPointsAction } = this.props;
    onClearTrashPointsAction();
  }

  onModeChanged = (index) => {
    this.setState(() => {
      return { mode: index };
    });
  }

  onCheckedChanged(checked, item) {
    if (checked) {
      this.marked.set(item.id, item);
    } else {
      this.marked.delete(item.id);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState((previousState) => {
      return {
        ...previousState,
        count: this.marked.size,
      };
    });
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
        default: break;
      }
    }
  }

  onMapTrashPointsSaved(selectedTrashPoints) {
    this.marked = new Map();
    selectedTrashPoints.forEach((trashPoint) => {
      this.marked.set(trashPoint.id, trashPoint);
    });
    this.setState(() => {
      return {
        trashPoints: this.props.trashPoints,
        count: this.marked.size,
      };
    });
  }

  onQueryChange = debounce((text) => {
    this.query = text;
    this.page = 0;
    const { onSearchTrashPointsAction } = this.props;

    onSearchTrashPointsAction(this.query, this.page, PAGE_SIZE, this.props.location);
  }, 1000);

  getTrashPointsFromState() {
    return this.state.trashPoints;
  }

  marked = new Map();
  page = 0;
  query = undefined;

  isProgressEnabled() {
    return this.props.isLoading;
  }

    keyExtractor = item => item.id.toString() + this.marked.has(item.id);

    spinner() {
      return (
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          color="rgb(0, 143, 223)"
        />
      );
    }

    changeRegion = (center) => {
      this.setState((previousState) => {
        return {
          ...previousState,
          region: center,
        };
      });
    }
    loadTrashpointsOnArea = () => {
      const adjustLongitude = (n) => {
        if (n < -180) {
          return 360 + n;
        }
        if (n > 180) {
          return n - 360;
        }
        return n;
      };
      const adjustLatitude = (n) => {
        const signMultiplier = n > 0 ? 1 : -1;
        if (Math.abs(n) > 90) {
          return signMultiplier * 89.999;
        }

        return n;
      };
      const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state.region;
      const northWest = {
        latitude: adjustLatitude(latitude + latitudeDelta / 2),
        longitude: adjustLongitude(longitude - longitudeDelta / 2),
      };
      const southEast = {
        latitude: adjustLatitude(latitude - latitudeDelta / 2),
        longitude: adjustLongitude(longitude + longitudeDelta / 2),
      };

      const delta = {
        latitudeDelta,
        longitudeDelta,
      };

      if (this.props.datasetUUIDSelector) {
        this.props.loadTrashPointsForMapAction({
          datasetId: this.props.datasetUUIDSelector,
          viewPortLeftTopCoordinate: northWest,
          viewPortRightBottomCoordinate: southEast,
          delta,
        });
      }
    }
    renderSeparator = () => {
      return (
        <View style={styles.listDivider} />
      );
    };

    renderFooter = () => {
      if (this.isProgressEnabled() && this.page === 0) {
        return null;
      } else if (this.isProgressEnabled() && this.page > 0) {
        return (
          <View
            style={styles.paginationFooter}
          >
            {this.spinner()}
          </View>
        );
      }
      return (<View style={styles.listDivider} />);
    };
    renderProgress() {
      if (this.isProgressEnabled() && this.page === 0) {
        return this.spinner();
      }
      return null;
    }
    renderItem = ({ item }) => (
      <ListItem
        onCheckedChanged={this.onCheckedChanged.bind(this)}
        checked={this.marked.has(item.id)}
        navigator={this.props.navigator}
        item={item}
        id={item.id}
      />
    );
    renderHeader = () => {
      if (this.isProgressEnabled() && this.page === 0) {
        return null;
      }
      return (<View style={styles.listDivider} />);
    };


    renderSearchBox() {
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

    renderCounter() {
      const count = this.state.count;
      if (count > 0) {
        return (
          <View style={styles.counterContainer}>
            <Text style={styles.counter}>
              {strings.formatString(strings.trashPoints_counter, count)}
            </Text>
          </View>
        );
      }
      return null;
    }
    renderContent = () => {
      const { longitude, latitude } = this.state.region;
      const location = { longitude, latitude };
      switch (this.state.mode) {
        case MODE.list: {
          return (
            <FlatList
              ListFooterComponent={this.renderFooter.bind(this)}
              ListHeaderComponent={this.renderHeader.bind(this)}
              style={styles.list}
              ItemSeparatorComponent={this.renderSeparator.bind(this)}
              data={this.getTrashPointsFromState()}
              keyExtractor={this.keyExtractor.bind(this)}
              renderItem={this.renderItem.bind(this)}
            />
          );
        }
        case MODE.map: {
          return (
            <TrashpointMap
              location={location}
              selectedTrashPoints={this.marked}
              trashPoints={this.state.trashPoints}
              onMapTrashPointsSaved={this.onMapTrashPointsSaved.bind(this)}
              onCheckedChanged={this.onCheckedChanged.bind(this)}
              onSearchArea={this.loadTrashpointsOnArea}
              changeRegion={this.changeRegion}
              navigator={this.props.navigator}
              isEmpty={this.props.isEmpty}
            />
          );
        }
        default:
      }
    }
    render() {
      return (
        <View style={[styles.containerContent]}>
          <View style={[styles.mainContentContainer,
            styles.containerContent, styles.vertical]}
          >
            {this.renderSearchBox()}
            {this.renderCounter()}
            {this.renderContent()}
          </View>
          {this.renderProgress()}
        </View>
      );
    }
}

function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    const context = this,
      args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

AddTrashPoints.propTypes = {
  selectedTrashPoints: PropTypes.array,
  trashPoints: PropTypes.object,
  isLoading: PropTypes.bool,
  location: PropTypes.object,
  navigator: PropTypes.object,
  onSearchTrashPointsAction: PropTypes.func,
  onClearTrashPointsAction: PropTypes.func,
  onTrashPointsSelected: PropTypes.func,
};

export default AddTrashPoints;
