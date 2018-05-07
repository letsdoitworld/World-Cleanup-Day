import React, {Component} from 'react';
import {
  Image,
  ImageBackground,
  Animated,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
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

  componentDidMount() {
    this.onLoad();
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
    const {children, style = {}, ...props} = this.props;

    return (
      <View style={{flex: 1}}>
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
        <ImageBackground {...props} style={[style]}>
          {children}
        </ImageBackground>
      </View>
    );
  }
}
