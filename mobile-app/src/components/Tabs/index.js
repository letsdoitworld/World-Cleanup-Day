import React, { Component } from 'react';

import PropTypes from 'prop-types';
import TabNavigator from 'react-native-tab-navigator';
import toUpper from 'lodash/toUpper';

import styles, { initialLayout } from './styles';

class Tabs extends Component {

  state = {
    selectedTab: toUpper(this.props.tabs[0].name),
  };

  renderItem = (item) => {
    return <TabNavigator.Item
      key={item.name}
      selected={toUpper(this.state.selectedTab) === toUpper(item.name)}
      title={item.name}
      titleStyle={styles.title}
      selectedTitleStyle={styles.selectedTitle}
      style={styles.tab}
      // onPress={() => this.setState({ selectedTab: toUpper(item.name) })}
    >
      {item.content()}
    </TabNavigator.Item>;
  }

  render() {
    return (
      <TabNavigator
        tabBarStyle={styles.tabBar}
        tabBarShadowStyle={styles.tabBarShadow}
        s
        style={styles.tabContainer}
      >
        {this.props.tabs && this.props.tabs.map(item => {
          return this.renderItem(item);
        })}
      </TabNavigator>
    );
  }
}

Tabs.propTypes = {
  tabs: PropTypes.array.isRequired,
};

export { Tabs };

