import React from 'react';
import { Animated, Easing } from 'react-native';
import { wrapDisplayName } from 'recompose';

export const withLoadingScreen = () => (Component) => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        opacity: new Animated.Value(0),
      };

      this.displayName = wrapDisplayName(Component, 'withNavigationHelpers');
    }

    componentDidMount() {
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }).start();
    }

    render() {
      return (
        <Animated.View style={{ opacity: this.state.opacity }}>
          <Component {...this.props} />
        </Animated.View>
      );
    }
  };
};
