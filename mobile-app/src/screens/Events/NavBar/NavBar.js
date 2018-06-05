import React, { Component } from 'react';
import { View, Platform, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import strings from '../../../assets/strings';
import styles from './styles';

export default class NavBar extends Component {
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
    const firstTabStyle = [{ borderRightWidth: 0,
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12 }];
    const lastTabStyle = [{ borderLeftWidth: 1,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12 }];
    return (
      <View
        style={[!(Platform.OS === 'ios')
          ? [styles.tabsContainerStyle, { borderRadius: 12 }]
          : [styles.tabsContainerStyle, { alignSelf: 'center' }]]}
        removeClippedSubviews={false}
      >
        <TouchableOpacity
          style={[
            { height: 28 },
            styles.tabStyle,
            this.state.selectedIndex === 0
              ? [{ backgroundColor: '#0082C0' }, styles.activeTabStyle]
              : {},
            firstTabStyle]}
          onPress={() => this.handleIndexChange(0)}
          activeOpacity={1}
        >
          <View style={styles.segmentContainer}>
            <Text
              style={[
                styles.tabTextStyle,
                this.state.selectedIndex === 0 ? [{ color: 'white' }] : {}]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {strings.label_nav_bar_list}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            { height: 28 },
            styles.tabStyle,
            this.state.selectedIndex === 1
              ? [{ backgroundColor: '#0082C0' }, styles.activeTabStyle] : {},
            lastTabStyle]}
          onPress={() => this.handleIndexChange(1)}
          activeOpacity={1}
        >
          <View style={styles.segmentContainer}>
            <Text
              style={[
                styles.tabTextStyle,
                this.state.selectedIndex === 1 ? [{ color: 'white' }] : {}]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {strings.label_nav_bar_map}
            </Text>
          </View>
        </TouchableOpacity>
      </View>);
  }
}

NavBar.propTypes = {
  index: PropTypes.number,
  handleIndexChange: PropTypes.func,
};
