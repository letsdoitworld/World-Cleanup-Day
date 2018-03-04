import React, {Component} from 'react';
import {
    View, TouchableOpacity, Text, ScrollView,
    TextInput, Image, TouchableHighlight
} from 'react-native';
import styles from './styles'
import strings from '../../../assets/strings'
import MainButton from '../../../components/Buttons/MainButton'
import InputField from '../../../components/InputFields/InputField'
import constants from "../../../shared/constants";
import * as Immutable from "../../../../node_modules/immutable/dist/immutable";
import ImmutableComponent from "../../../components/InputFields/ImmutableComponent";
import DateTimePicker from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';


export default class CreateEvent extends ImmutableComponent {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarTitleTextCentered: true,
    };

    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    whatToBring: string;

    constructor(props) {
        super(props);
        this.title = "";
        this.description = "";
        this.whatToBring = "";
        this.state = {
            data: Immutable.Map({
                isTitleValid: false,
                isDescriptionValid: false,
                isWhatToBringValid: false,
                isStartDateValid: false,
                isEndDateValid: false,
                isDateTimePickerVisible: false,
                imageUrl: '',
            })
        }
    }

    render() {
        const isTitleValid = this.state.data.get('isTitleValid');
        const isDescriptionValid = this.state.data.get('isDescriptionValid');
        const isWhatToBringValid = this.state.data.get('isWhatToBringValid');
        const imagePath = this.state.data.get('imageUrl');

        const isValid = isTitleValid && isDescriptionValid && isWhatToBringValid;

        return (
            <View>
                <ScrollView style={styles.container}>

                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_title.toUpperCase()}</Text>
                    </View>
                    <View style={styles.inputContainerStyle}>
                        <InputField style={styles.inputTextStyle}
                                    placeholder={strings.label_title_hint}
                                    autoCorrect={false}
                                    validate={this.validateTitle}
                                    onChangeText={this.onTitleTextChanged}/>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_date_and_time.toUpperCase()}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../images/ic_time.png')}
                                   style={styles.imageItemStyle}/>
                        </View>
                        <View style={styles.dateAndTimeContainerStyle}>
                            <View style={styles.dateAndTimeRowStyle}>
                                <Text style={styles.dateTitleTextStyle}>{strings.label_start}</Text>
                                <TouchableOpacity style={{
                                    flex: 1,
                                    alignSelf: 'center'
                                }}
                                onPress={this.showDateTimePicker}>
                                    <Text style={styles.dateTextStyle}>{strings.label_date}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    flex: 1,
                                    alignSelf: 'center'
                                }}>
                                    <Text style={styles.dateTextStyle}>{strings.label_no_selected}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.dividerStyle}/>
                            <View style={styles.dateAndTimeRowStyle}>
                                <Text style={styles.dateTitleTextStyle}>{strings.label_end}</Text>
                                <TouchableOpacity style={{
                                    flex: 2,
                                    alignSelf: 'center'
                                }}>
                                <Text style={styles.dateTextStyle}>{strings.label_no_selected}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_location.toUpperCase()}</Text>
                    </View>
                    <View style={styles.locationContainerStyle}>
                        <Image source={require('../../../../src/assets/images/ic_location.png')}
                               style={styles.imageTrashStyle}/>
                        <Text style={styles.textTrashStyle}>{strings.label_add_location}</Text>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_trashpoints.toUpperCase()}</Text>
                    </View>
                    <View style={styles.trashpointTipStyle}>
                        <Image source={require('../images/ic_trashpoints.png')}
                               style={styles.imageTrashStyle}/>
                        <Text style={styles.textTrashStyle}>{strings.label_tip_add_trashpoints}</Text>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_description.toUpperCase()}</Text>
                    </View>
                    <View style={styles.descriptionContainerStyle}>
                        <InputField style={styles.inputTextStyle}
                                    placeholder={strings.label_ignite_people_to_participate}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    multiline={true}
                                    validate={this.validateDescription}
                                    onChangeText={this.onDescriptionTextChanged}/>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_what_to_bring_with_you.toUpperCase()}</Text>
                    </View>
                    <View style={styles.whatBringContainerStyle}>
                        <InputField style={styles.inputTextStyle}
                                    placeholder={strings.label_specify_tools_for_work}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    multiline={true}
                                    validate={this.validateWhatToBring}
                                    onChangeText={this.onWhatToBringTextChanged}/>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_cover_photo.toUpperCase()}</Text>
                    </View>
                    <View style={styles.eventPhotoContainerStyle}>
                        <Image source={{uri: imagePath}}/>
                        <TouchableOpacity onPress={() => this.openCamera()}>
                        <Image style={styles.addPhotoIconStyle}
                               source={require('../images/ic_add_photo.png')}/>
                        </TouchableOpacity>
                        <Text style={styles.addPhotoTextStyle}>{strings.label_add_photo}</Text>
                    </View>

                    <MainButton
                        disabled={!isValid}
                        text={strings.label_next}
                        style={styles.nextButtonStyle}
                        onPress={() => console.log("Press")}/>

                </ScrollView>

            </View>
        )
    }
    //TODO ask Yulia about dialog!!

    openGallery() {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.warn("Image: ", image.path);
            this.setData(d => d.set('imageUrl', image.path))
        });
    };

    openCamera() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.warn("Image: ", image.path);
            this.setData(d => d.set('imageUrl', image.path))
        });
    }

    onTitleTextChanged = (text: String) => {
        this.title = text;
    };

    onDescriptionTextChanged = (text: String) => {
        this.description = text;
    };

    onWhatToBringTextChanged = (text: String) => {
        this.whatToBring = text;
    };

    validateTitle = (text: String): boolean => {
        let isValid = constants.TITLE_REGEX.test(text);
        this.setData(d => d.set('isTitleValid', isValid));
        return isValid
    };

    validateDescription = (text: String): boolean => {
        let isValid = constants.TITLE_REGEX.test(text);
        this.setData(d => d.set('isDescriptionValid', isValid));
        return isValid
    };

    validateWhatToBring = (text: String): boolean => {
        let isValid = constants.TITLE_REGEX.test(text);
        this.setData(d => d.set('isWhatToBringValid', isValid));
        return isValid
    };

    showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    handleDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        this.hideDateTimePicker();
    };

}