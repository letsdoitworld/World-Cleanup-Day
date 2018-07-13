import React, { Component } from 'react';
import {
  View,
  Dimensions,
  Text,
  Platform,
} from 'react-native';
import strings from '../../assets/strings';

const { width } = Dimensions.get('window');

export const LEVEL = {
  HANDFUL: 'handful',
  BAGFUL: 'bagful',
  CARTLOAD: 'cartload',
  TRUCK: 'truck',
};

const blueDot = {
  width: 10,
  height: 10,
  borderRadius: 5,
  overflow: 'hidden',
  backgroundColor: 'rgb(0, 143, 223)',
  position: 'absolute',
  top: 7,
};

const front = {
  height: 10,
  backgroundColor: 'rgb(0, 143, 223)',
  borderRadius: 5,
  overflow: 'hidden',
  position: 'absolute',
  top: 7,
};

const truck = {
  width: 24,
  height: 24,
  backgroundColor: 'white',
  borderRadius: 12,
  overflow: 'hidden',
  position: 'absolute',
  ...Platform.select({
    ios: {
      shadowColor: 'rgba(0,0,0, 0.4)',
      shadowOffset: { height: 1, width: 1 },
      shadowOpacity: 0.7,
      shadowRadius: 5,
    },
    android: {
      elevation: 4,
    },
  }),

};

const labels = {
  flexDirection: 'row',
  marginTop: 17,
};

const label = {
  flex: 1,
  textAlign: 'center',
  fontFamily: 'Lato-Bold',
  fontSize: 12,
  color: 'rgb(40, 38, 51)',
  letterSpacing: 0.4,
};


export default class TrashAmountLevel extends Component {
  constructor(props) {
    super(props);
    const { paddingHorizontal } = this.props;

    this.containerStyle = {
      marginTop: 12,
      paddingHorizontal,
      marginBottom: 14,
    };

    this.componentWidth = width - paddingHorizontal * 2;

    this.one_to_eight = this.componentWidth / 8;

    this.back = {
      width: this.componentWidth,
      height: 10,
      backgroundColor: 'white',
      borderRadius: 5,
      overflow: 'hidden',
      marginTop: 7,
    };
    this.mapLevel(props);
  }

  componentWillReceiveProps(nextProps) {
    switch (nextProps.level) {
      case LEVEL.HANDFUL: {
        this.frontRight = this.one_to_eight * 7;
        break;
      }
      case LEVEL.BAGFUL: {
        this.frontRight = this.one_to_eight * 5;
        break;
      }
      case LEVEL.CARTLOAD: {
        this.frontRight = this.one_to_eight * 3;
        break;
      }
      case LEVEL.TRUCK: {
        this.frontRight = this.one_to_eight;
        break;
      }
      default: null;
    }
  }

  mapLevel(props) {
    switch (props.level) {
      case LEVEL.HANDFUL: {
        this.frontRight = this.one_to_eight * 7;
        break;
      }
      case LEVEL.BAGFUL: {
        this.frontRight = this.one_to_eight * 5;
        break;
      }
      case LEVEL.CARTLOAD: {
        this.frontRight = this.one_to_eight * 3;
        break;
      }
      case LEVEL.TRUCK: {
        this.frontRight = this.one_to_eight;
        break;
      }
      default:
        null;
    }
  }

  render() {
    return (
      <View style={this.containerStyle}>
        <View>
          <View style={this.back} />
          <View style={[front,
            { left: 0,
              right: this.frontRight - 10,
              width: this.componentWidth - this.frontRight }]}
          />
          <View style={[truck, { right: this.frontRight - 12 }]} />
          <View style={[blueDot, { left: this.one_to_eight - 5 }]} />
          <View style={[blueDot, { left: this.one_to_eight * 3 - 5 }]} />
          <View style={[blueDot, { left: this.one_to_eight * 5 - 5 }]} />
          <View style={[blueDot, { left: this.one_to_eight * 7 - 5 }]} />
        </View>
        <View style={labels}>
          <Text style={label}>
            {strings.label_handful}
          </Text>
          <Text style={label}>
            {strings.label_bagful}
          </Text>
          <Text style={label}>
            {strings.label_cartload}
          </Text>
          <Text style={label}>
            {strings.label_truck}
          </Text>
        </View>
      </View>
    );
  }
}
