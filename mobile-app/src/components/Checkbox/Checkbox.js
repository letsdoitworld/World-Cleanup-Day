import React, {Component} from "react";
import {Image, LayoutAnimation, TouchableWithoutFeedback, UIManager, View} from "react-native";
import styles from "./styles"


export default class Checkbox extends Component {

    constructor(props) {
        super(props);
        this.background = undefined;
        this.plus = undefined;

        this.state = {checked: this.props.checked !== undefined ? this.props.checked : false};
    }

    onPressCheck = () => {
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
