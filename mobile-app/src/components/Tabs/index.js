import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { TabBar, TabViewAnimated } from 'react-native-tab-view';
import PropTypes from 'prop-types';

import toUpper from 'lodash/toUpper';

import styles, { initialLayout } from './styles';
import strings from '../../config/strings';

class Tabs extends Component {

  state = {
    index: 0,
    routes: this.props.routes,
  };

  handleIndexChange = index => this.setState({ index });

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

  canJumpToTab = (route) => {
    switch (route.key) {
      case strings.label_events:
        return (route.enabled);
      case strings.label_trashpoints:
        return false;
    }
    return (route.enabled);
  };

  // renderScene = SceneMap(this.props.scenes);

  render() {
    return (
      <TabViewAnimated
        style={[styles.container, { flex: this.props.isVisible ? 1 : 0 }]}
        navigationState={this.state}
        renderScene={this.props.renderSceneTab}
        renderHeader={this.renderHeader}
        onIndexChange={this.handleIndexChange}
        initialLayout={initialLayout}
        canJumpToTab={this.canJumpToTab}
      />
    );
  }
}

Tabs.propTypes = {
  isVisible: PropTypes.bool,
  routes: PropTypes.array.isRequired,
  renderSceneTab: PropTypes.func.isRequired,
  // scenes: PropTypes.object.isRequired,
};

export { Tabs };

