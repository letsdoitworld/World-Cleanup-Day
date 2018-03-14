import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import PropTypes from 'prop-types';

import toUpper from 'lodash/toUpper';

import styles, { initialLayout } from './styles';

class Tabs extends Component {

  state = {
    index: 0,
    routes: this.props.routes,
  };

  handleIndexChange = (index) => this.setState({ index });

  handleRenderTab = ({ route, focused }) => {
    const textStyle = focused ? styles.labelFocused : styles.label;
    return (
      <View style={styles.tabContainer}>
        <Text style={textStyle}>{toUpper(route.title)}</Text>
      </View>
    );
  }

  renderHeader = props => (
    <TabBar
      {...props}
      renderLabel={this.handleRenderTab}
      style={styles.tabBarContainer}
      indicatorStyle={styles.textIndicator}
    />
  );

  renderScene = SceneMap(this.props.scenes);

  render() {

    return (
      <TabViewAnimated
        style={[styles.container, { flex: this.props.isVisible ? 1 : 0 }]}
        navigationState={this.state}
        renderScene={this.renderScene}
        renderHeader={this.renderHeader}
        onIndexChange={this.handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

Tabs.propTypes = {
  isVisible: PropTypes.bool,
  routes: PropTypes.array.isRequired,
  scenes: PropTypes.object.isRequired,
};

export { Tabs };

