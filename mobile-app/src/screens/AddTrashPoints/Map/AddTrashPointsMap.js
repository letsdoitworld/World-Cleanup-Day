/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import { Keyboard, Text, UIManager, View } from 'react-native';
import styles from './styles';
import { Map as MapView } from '../../../components';
import { DEFAULT_ZOOM } from '../../../shared/constants';
import strings from '../../../assets/strings';
import { renderItem } from '../Item/ListItem';
import { TRASH_POINT } from '../../index';

export default class TrashpointMap extends Component {
  constructor(props) {
    super(props);
    const { selectedTrashPoints, trashPoints } = props;

    selectedTrashPoints.forEach((trashPoint) => {
      this.marked.set(trashPoint.id, trashPoint);
    });

    const markers = trashPoints.map((trashPoint) => {
      return {
        id: trashPoint.id,
        latlng: trashPoint.location,
        status: trashPoint.status,
        isMarked: this.marked.has(trashPoint.id),
        item: trashPoint,
      };
    });
    this.initialRegion = {
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude,
      latitudeDelta: DEFAULT_ZOOM,
      longitudeDelta: DEFAULT_ZOOM,
    };
    if (markers.length > 0) {
      markers[0].isSelected = true;
      this.state = {
        markers,
        selectedItem: markers[0].item,
        count: this.marked.size,
        showSearchButton: false,
        region: this.initialRegion,
        expandSearch: false,
      };
    } else {
      this.state = {
        markers,
        selectedItem: undefined,
        count: this.marked.size,
        showSearchButton: false,
        region: this.initialRegion,
        expandSearch: false,
        keyboardShown: false,
      };
    }

    UIManager.setLayoutAnimationEnabledExperimental
    && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
      this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
      this.keyboardDidHide);
  }

  componentWillReceiveProps(nextProps) {
    const receivedTrashPointsList = nextProps.trashPoints.map((trashPoint) => {
      return {
        id: trashPoint.id,
        latlng: trashPoint.location,
        status: trashPoint.status,
        isMarked: this.marked.has(trashPoint.id),
        item: trashPoint,
        isSelected: this.state.selectedItem
          ? trashPoint.id === this.state.selectedItem.id
          : false,
      };
    });
    if (receivedTrashPointsList === undefined) return;
    if (receivedTrashPointsList !== this.state.markers) {
      if (receivedTrashPointsList.length > 0) {
        if (!this.state.selectedItem) {
          receivedTrashPointsList[0].isSelected = true;
        }
        this.setState({
          markers: receivedTrashPointsList,
          selectedItem: this.state.selectedItem
            ? this.state.selectedItem
            : receivedTrashPointsList[0].item,
          expandSearch: false,
        });
      } else {
        this.setState({
          markers: [],
          selectedItem: undefined,
        });
      }
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onCheckedChanged = (checked, item) => {
    if (checked) {
      this.marked.set(item.id, item);
    } else {
      this.marked.delete(item.id);
    }

    const markers = this.props.trashPoints.map((trashPoint) => {
      return {
        id: trashPoint.id,
        latlng: trashPoint.location,
        status: trashPoint.status,
        isMarked: this.marked.has(trashPoint.id),
        item: trashPoint,
        isSelected: this.state.selectedItem.id === trashPoint.id,
      };
    });
    this.props.onCheckedChanged(checked, item);
    this.setState((previousState) => {
      return {
        ...previousState,
        markers,
      };
    });
  };


  onAddedPress(checked) {
    this.onCheckedChanged(checked, this.state.selectedItem);
  }


    count = 0;


    handleOnMarkerPress(marker) {
      const markers = this.props.trashPoints.map((trashPoint) => {
        return {
          id: trashPoint.id,
          latlng: trashPoint.location,
          status: trashPoint.status,
          isMarked: this.marked.has(trashPoint.id),
          item: trashPoint,
          isSelected: trashPoint.id === marker.id,
        };
      });

      this.setState((previousState) => {
        return {
          ...previousState,
          selectedItem: marker.item,
          markers,
        };
      });
    }

  toggleSearchButton = (state) => {
    this.setState({ showSearchButton: state });
  };
  handleOnRegionChangeComplete = (center) => {
    if (center !== this.state.region) {
      this.toggleSearchButton(true);
    }
    this.props.changeRegion(center);
    this.setState((previousState) => {
      return {
        ...previousState,
        region: center,
      };
    });
  };
  marked = new Map();
  expandSearch = () => {
    this.setState({ expandSearch: false });
  };

  keyboardDidShow = () => {
    this.setState({ keyboardShown: true });
  };

  keyboardDidHide = () => {
    this.setState({ keyboardShown: true });
  };

  renderCounter() {
    const count = this.state.count;
    const text = count > 0
      ? strings.formatString(strings.trashPoints_counter, count)
      : strings.label_no_trashpoints_selected;
    return (
      <View style={styles.counterContainer}>
        <Text style={styles.counter}>
          {text}
        </Text>
      </View>
    );
  }

  renderSelectedItem(selectedItem, checked) {
    if (checked === undefined) return null;

    if (selectedItem) {
      const onPress = () => {
        this.props.navigator.push({
          screen: TRASH_POINT,
          title: strings.label_trashpoint,
          passProps: {
            onCheckedChanged: this.onAddedPress.bind(this),
            trashPointId: selectedItem.id,
            trashPoint: selectedItem,
            isChecked: checked,
            cancelTrashPointFromEvent: true },
        });
      };

      return renderItem(
        selectedItem,
        checked,
        styles.trashPointItem,
        onPress,
        this.onCheckedChanged,
      );
    }
    return null;
  }

  render() {
    const { selectedItem } = this.state;

    const checked = selectedItem ? this.marked.has(selectedItem.id) : undefined;

    let selectedRegion;
    if (selectedItem) {
      selectedRegion = {
        latitude: selectedItem.location.latitude,
        longitude: selectedItem.location.longitude,
        latitudeDelta: DEFAULT_ZOOM,
        longitudeDelta: DEFAULT_ZOOM,
      };
    }

    return (
      <View style={styles.container}>
        <MapView
          handleOnMarkerPress={this.handleOnMarkerPress.bind(this)}
          markers={this.state.markers}
          initialRegion={this.initialRegion}
          region={++this.count === 1 ? this.initialRegion : selectedRegion}
          style={styles.map}
          getRef={map => this.map = map}
        />
        {!this.state.keyboardShown && this.renderSelectedItem(selectedItem, checked)}
      </View>
    );
  }
}
