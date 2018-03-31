import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    Image, Dimensions,
} from 'react-native';
import Slider from 'react-native-slider';

const {height, width} = Dimensions.get('window');
import {getWidthPercentage} from '../../shared/helpers';

const GradationLine = (props) => (
    <View
        style={{
            width: 2,
            height: getWidthPercentage(15),
            backgroundColor: "#4AA5FF",
        }}
    />
);

const Gradation = (props) => (
    <View
        style={{
            width: 65,
            position: 'absolute',
            left: props.position,
            top: 40,
            flexDirection: 'column',
            alignItems: 'center',
        }}
    >
        <Image
            source={props.image}
            resizeMode="contain"
            style={{
                marginBottom: 10,
                width: props.imageSize,
                height: props.imageSize,
            }}
        />
        {props.text}
    </View>
);
Gradation.defaultProps = {
    imageSize: getWidthPercentage(23),
};
Gradation.propTypes = {
    imageSize: PropTypes.number,
    text: PropTypes.object
};

const CustomSlider = (props) => {

    this.componentWidth = width - props.paddingHorizontal * 4;

    this.one_to_eight = (this.componentWidth / 3) + (props.knobSize / 2) - 20;

    this.gradationPosition = props.paddingHorizontal * 2 + props.knobSize / 2 - 32.5;

    return (
        <View
            style={{
                backgroundColor: '#eeeeee',
                height: 110,
                flexDirection: 'column',
                width: width,
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'center'
            }}
        >

            <View
                style={{
                    alignSelf: 'flex-start',
                    position: 'absolute',
                    top: 14,
                    left: props.paddingHorizontal,
                    height: props.trackHeight,
                    backgroundColor: '#4AA5FF',
                    borderRadius: props.trackHeight,
                    width: width - props.paddingHorizontal * 3,
                }}
            />

            <View
                style={{
                    alignSelf: 'flex-start',
                    position: 'absolute',
                    top: 14,
                    right: props.paddingHorizontal,
                    height: props.trackHeight,
                    backgroundColor: '#F7F7F7',
                    borderRadius: props.trackHeight,
                    width: width - props.paddingHorizontal * 3,
                }}
            />

            <Slider
                width={width - props.paddingHorizontal * 4}
                maximumValue={props.maximumValue}
                step={props.step}
                onValueChange={props.onValueChange}
                trackStyle={{
                    height: props.trackHeight,
                    backgroundColor: '#F7F7F7',
                    borderRadius: props.trackHeight,
                    width: width - props.paddingHorizontal * 3,
                }}
                thumbStyle={{
                    height: props.knobSize,
                    width: props.knobSize,
                    borderRadius: props.knobSize,
                    borderColor: '#FFFFFF',
                    borderWidth: props.knobSize - props.innerKnobSize,
                    backgroundColor: '#4AA5FF',
                }}
                style={{
                    // paddingHorizontal: 30
                    // position: 'absolute',
                    // bottom: 0,
                }}
                minimumTrackTintColor="#4AA5FF"
                maximumTrackTintColor="#4AA5FF"
            />

            {
                props.gradationData.map(data => {
                    const view = <Gradation
                        key={data.text}
                        position={this.gradationPosition}
                        image={data.image}
                        text={data.text}
                    />;
                    this.gradationPosition += this.one_to_eight;
                    return view;
                })
            }
        </View>
    );
};

CustomSlider.defaultProps = {
    knobSize: getWidthPercentage(20),
    innerKnobSize: getWidthPercentage(15),
    trackHeight: getWidthPercentage(9),
};

CustomSlider.propTypes = {
    paddingHorizontal: PropTypes.number.isRequired,
   // width: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    maximumValue: PropTypes.number.isRequired,
    onValueChange: PropTypes.func,
    knobSize: PropTypes.number,
    innerKnobSize: PropTypes.number,
    trackHeight: PropTypes.number,
    gradationData: PropTypes.shape({
        position: PropTypes.number.isRequired,
        image: PropTypes.object,
    })
};

export default CustomSlider;