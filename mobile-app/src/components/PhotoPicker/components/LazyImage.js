import React, { Component } from 'react';
import {
  Animated,
  View,
} from 'react-native';

const loadingImg = require('./img_loading.png');

export class LazyImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      opacity: new Animated.Value(1),
    };
  }
  onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 250,
    }).start(() => {
      this.setState({
        loaded: true,
      });
    });
  };
  render() {
    const { children, style = {}, ...props } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {!this.state.loaded &&
          <Animated.Image
            style={[
              style,
              {
                opacity: this.state.opacity,
              },
            ]}
            {...props}
            source={loadingImg}
          />}
        <Animated.Image {...props} style={[style]} onLoad={this.onLoad}>
          {children}
        </Animated.Image>
      </View>
    );
  }
}
