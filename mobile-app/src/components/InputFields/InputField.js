
import React, {Component} from "react";
import {
    LayoutAnimation,
    NativeModules,
    TextInput,
    View
} from "react-native";
import colors from "../../config/colors";
import * as Immutable from "../../../node_modules/immutable/dist/immutable";
import ImmutableComponent from "./ImmutableComponent";

const {UIManager} = NativeModules;

const CustomLayoutSpring = {
    duration: 400,
    create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.2,
    },
    update: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.8,
    },
};

export default class InputField extends ImmutableComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: Immutable.Map({
                errorColor: props.errorColor,
                error: "",
                isPasswordVisible: !this.props.secureTextEntry,
                cursorPosition: undefined

            })
        };
        this.text = '';
    }

    //noinspection JSMethodCanBeStatic
    render() {

        const {
            style,
            label,
            error,
            value,
            onSubmitEditing,
            returnKeyType,
            reference
        } = this.props;

        if (this.text === '') {
            this.text = value
        }

        return (
            <View style={style}>
                <TextInput
                    ref={reference}
                    onSubmitEditing={onSubmitEditing}
                    returnKeyType={returnKeyType}
                    value={this.text}
                    selection={this.state.data.get('cursorPosition')}
                    secureTextEntry={!this.state.data.get('isPasswordVisible') && secureTextEntry}
                    underlineColorAndroid={'transparent'}
                    error={this.dataValue('error')}
                    errorColor={this.dataValue('errorColor')}
                    label={label}
                    onChangeText={this.onChangeText}
                    style = {styles.textStyle}
                    onFocus={this.focusAcquired}
                    onBlur={this.focusLost}/>
            </View>
        );
    }

    onChangeText = (text: String) => {

        this.text = text;

         this.setData(d => d
             .set('cursorPosition', undefined)
         );

        if (!this.props.validate(text)) {
            this.setData(d => d.set('error', this.props.errorString))
        } else {
            this.setData(d => d.set('error', ''))
        }
        this.props.onChangeText(text)
    };

    focusAcquired = () => {
        this.setData(d => d.set('errorColor', colors.$dividerColor))
    };

    focusLost = () => {
        this.setData(d => d.set('errorColor', 'red'))
    }

}

const styles = {
    textStyle: {
        fontSize: 17,
        fontFamily: 'Lato-Regular'
    }
};
