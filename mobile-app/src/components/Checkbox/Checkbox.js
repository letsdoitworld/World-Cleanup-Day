import React, {Component} from "react";
import {Image, LayoutAnimation, TouchableWithoutFeedback, UIManager, View} from "react-native";

var CustomLayoutSpring = {
    duration: 400,
    create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
    },
    update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
    },
};

export default class Checkbox extends Component {

    constructor(props) {
        super(props);
        this.background = undefined;
        this.plus = undefined;

        this.state = {checked: this.props.checked !== undefined ? this.props.checked : false};

        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    onPressCheck = () => {
        LayoutAnimation.configureNext(CustomLayoutSpring);

        this.setState({checked: !this.state.checked});

        if (this.props.onCheckedChanged) {
            this.props.onCheckedChanged(!this.state.checked);
        }

    };

    componentWillReceiveProps(nextProps) {
        this.setState({checked: nextProps.checked !== undefined ? nextProps.checked : false});
    }

    render() {

        let image;

        if (this.state.checked) {
            image = require('../../assets/images/followingButton.png');
        } else {
            image = require('../../assets/images/btnAdd.png');
        }

        return (
            <TouchableWithoutFeedback
                disabled={this.props.disabled}
                style={[styles.imageContainer, this.props.style]}
                onPress={this.onPressCheck.bind(this)}>
                <Image
                    source={image}
                    style={this.props.style}/>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = {
    imageContainer: {
        width: 54,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outline: {
        width: 44,
        height: 44,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    background: {
        width: 0,
        height: 0,
        borderRadius: 500,
        alignSelf: 'center',

    },
    icon: {
        height: 12,
        width: 12,
        padding: 20,
        resizeMode: 'center',
        position: 'absolute',
    }
};