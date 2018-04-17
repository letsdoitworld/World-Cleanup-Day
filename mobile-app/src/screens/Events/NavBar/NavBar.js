import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import strings from '../../../assets/strings';
import styles from './styles';

export default class EventsNavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: props.index ? props.index : 0,
    };
  }

  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
    this.props.handleIndexChange(index);
  };

  render() {
    return (
      <View style={styles.container}>
        <SegmentedControlTab
          tabsContainerStyle={(Platform.OS === 'ios') && (this.state.selectedIndex === 1) ? styles.tabsIOSContainerStyle : styles.tabsContainerStyle}
          tabTextStyle={styles.tabTextStyle}
          activeTabStyle={styles.activeTabStyle}
          borderRadius={12}
          values={[strings.label_nav_bar_list, strings.label_nav_bar_map]}
          selectedIndex={this.state.selectedIndex}
          onTabPress={this.handleIndexChange}
        />
      </View>);
  }
}
