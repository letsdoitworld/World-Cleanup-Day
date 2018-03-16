
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
import {getWidthPercentage} from "../../shared/helpers";

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
                cursorPosition: undefined,
                text: '',
            })
        };
    }

    //noinspection JSMethodCanBeStatic
    render() {

        const {
            style,
            label,
            placeholder,
            error,
            value,
            onSubmitEditing,
            returnKeyType,
            reference,
            keyboardType,
            autoCapitalize,
            maxLength,
            multiline

        } = this.props;

        if (this.state.data.get('text') === '') {
            this.setState({ text: value })
        }

        return (
            <View style={style}>
                <TextInput
                    ref={reference}
                    onSubmitEditing={onSubmitEditing}
                    returnKeyType={returnKeyType}
                    keyboardType={keyboardType}
                    placeholder={placeholder}
                    value={this.state.data.get('text')}
                    selection={this.state.data.get('cursorPosition')}
                    underlineColorAndroid={'transparent'}
                    error={this.dataValue('error')}
                    errorColor={this.dataValue('errorColor')}
                    label={label}
                    autoCapitalize = {autoCapitalize}
                    onChangeText={this.onChangeText}
                    style = {styles.textStyle}
                    onFocus={this.focusAcquired}
                    maxLength = {maxLength}
                    multiline = {multiline}
                    onBlur={this.focusLost}/>
            </View>
        );
    }

    onChangeText = (text: String) => {

        this.setData(d => d.set('text', text));

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
        this.setData(d => d.set('errorColor', colors.$errorColor))
    };

    focusLost = () => {
        this.setData(d => d.set('errorColor', 'red'))
    }

}

const styles = {
    textStyle: {
        left: getWidthPercentage(6),
        fontSize: 17,
        fontFamily: 'Lato-Regular'
    }
};
