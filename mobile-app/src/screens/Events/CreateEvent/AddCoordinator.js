import React, {Component} from 'react';
import ImmutableComponent from "../../../components/InputFields/ImmutableComponent";
import {
    View, TouchableOpacity, Text, ScrollView,
    TextInput, Image, TouchableHighlight
} from 'react-native';
import styles from "./styles";
import strings from "../../../assets/strings";
import InputField from '../../../components/InputFields/InputField';
import MainButton from '../../../components/Buttons/MainButton'

export default class AddCoordinator extends ImmutableComponent {

    render() {
        return(<View>
            <View style={styles.titleStyle}>
                <Text style={styles.titleTextStyle}>{strings.label_coordinator.toUpperCase()}</Text>
            </View>
            <View style={styles.inputContainerStyle}>
                <InputField style={styles.inputTextStyle}
                            placeholder={strings.label_coordinator_hint}
                            autoCorrect={false}
                            onChangeText={() => console.log("Change")}/>
            </View>
            <View style={styles.titleStyle}>
                <Text style={styles.titleTextStyle}>{strings.label_organization.toUpperCase()}</Text>
            </View>
            <View style={styles.inputContainerStyle}>
                <InputField style={styles.inputTextStyle}
                            placeholder={strings.label_organization_hint}
                            autoCorrect={false}
                            onChangeText={() => console.log("Change")}/>
            </View>
            <View style={styles.titleStyle}>
                <Text style={styles.titleTextStyle}>{strings.label_contact_details.toUpperCase()}</Text>
            </View>
            <View style={styles.locationContainerStyle}>
                <Image source={require('../../../assets/images/ic_phone_number.png')}
                       style={styles.imageTrashStyle}/>
                <InputField style={styles.inputTextStyle}
                            placeholder={strings.label_organization_hint}
                            autoCorrect={false}
                            onChangeText={() => console.log("Change")}/>
            </View>
            <View style={styles.locationContainerStyle}>
                <Image source={require('../../../assets/images/ic_email.png')}
                       style={styles.imageTrashStyle}/>
                <InputField style={styles.inputTextStyle}
                            placeholder={strings.label_organization_hint}
                            autoCorrect={false}
                            onChangeText={() => console.log("Change")}/>
            </View>
            <MainButton
                disabled={!isValid}
                text={strings.label_next}
                style={styles.nextButtonStyle}
                onPress={() => console.log("Press")}/>
        </View>)
    }
}