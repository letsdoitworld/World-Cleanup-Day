/* eslint-disable one-var,prefer-rest-params */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  UIManager,
  View,
  Platform,
} from 'react-native';
import styles from './styles';
import strings from '../../assets/strings';
import ListItem from './Item/ListItem';
import { NAV_BAR, SAVE_BUTTON } from '../index';
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
    rightButtons: [
      {
        title: strings.label_save,
        id: saveId,
        buttonColor: 'rgb(0, 143, 223)',
        buttonFontSize: 17,
        buttonFontFamily: 'Lato-Bold',
      },
    ],
  };

  constructor(props) {
    super(props);

    this.marked = props.selectedTrashPoints;

    this.state = {
      count: 0,
      trashPoints: [],
      mode: MODE.list,
    };

    this.props.navigator.setStyle({
      navBarCustomView: NAV_BAR,
      statusBarColor: 'white',
      statusBarTextColorScheme: 'dark',
      navBarComponentAlignment: 'fill',
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
      rightButtons: Platform.OS === 'android' ? [
        {
          id: saveId,
          component: SAVE_BUTTON,
          passProps: {
            onPress: () => {
              this.props.onTrashPointsSelected(this.marked);
              this.props.navigator.pop();
            },
          },
        },
      ] : [
        {
          title: strings.label_save,
          id: saveId,
          buttonColor: 'rgb(0, 143, 223)',
          buttonFontSize: 17,
          buttonFontFamily: 'Lato-Bold',
        },
      ],
    });

    UIManager.setLayoutAnimationEnabledExperimental
    && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    const { onSearchTrashPointsAction } = this.props;
    onSearchTrashPointsAction(null, 0, PAGE_SIZE, this.props.location);
  }

  componentWillReceiveProps(nextProps) {
    const receivedTrashPointsList = nextProps.trashPoints;

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
  }

  componentWillUnmount() {
    const { onClearTrashPointsAction } = this.props;
    onClearTrashPointsAction();
  }

  onModeChanged = (index) => {
    this.setState(() => {
      return { mode: index };
    });
  };

  onCheckedChanged(checked, item) {
    if (checked) {
      this.marked.set(item.id, item);
    } else {
      this.marked.delete(item.id);
    }
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

  handleLoadMore = () => {
    if (this.getTrashPointsFromState().length < PAGE_SIZE * (this.page + 1)) {
      return;
    }

    this.page++;

    const { onSearchTrashPointsAction } = this.props;
    onSearchTrashPointsAction(this.query, this.page, PAGE_SIZE, this.props.location);
  };


  spinner() {
    return (
      <ActivityIndicator
        style={styles.spinner}
        size="large"
        color="rgb(0, 143, 223)"
      />
    );
  }

  renderItem = ({ item }) => {
    return (
      <ListItem
        onCheckedChanged={this.onCheckedChanged.bind(this)}
        checked={this.marked.has(item.id)}
        navigator={this.props.navigator}
        item={item}
        id={item.id}
        cancelTrashPointFromEvent
      />
    );
  };

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

    renderHeader = () => {
      if (this.isProgressEnabled() && this.page === 0) {
        return null;
      }
      return (<View style={styles.listDivider} />);
    };

    renderSearchBox() {
      switch (this.state.mode) {
        case MODE.list: {
          return (
            <View style={[styles.horizontal, styles.searchContainerStyle]}>
              <TextInput
                placeholderTextColor="rgb(41, 127, 202)"
                style={styles.searchField}
                ref="input"
                onChangeText={this.onQueryChange.bind(this)}
                placeholder={strings.label_text_select_country_hint}
                underlineColorAndroid="transparent"
              />
            </View>
          );
        }
        default:
          return null;
      }
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
              onEndReached={this.handleLoadMore.bind(this)}
              onEndReachedThreshold={1}
            />
          );
        }
        case MODE.map: {
          return (
            <TrashpointMap
              location={this.props.location}
              selectedTrashPoints={this.marked}
              trashPoints={this.state.trashPoints}
              onMapTrashPointsSaved={this.onMapTrashPointsSaved.bind(this)}
              onCheckedChanged={this.onCheckedChanged.bind(this)}
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
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
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
  selectedTrashPoints: PropTypes.object,
  trashPoints: PropTypes.array,
  isLoading: PropTypes.bool,
  location: PropTypes.object,
  navigator: PropTypes.object,
  onSearchTrashPointsAction: PropTypes.func,
  onClearTrashPointsAction: PropTypes.func,
  onTrashPointsSelected: PropTypes.func,
};

export default AddTrashPoints;
