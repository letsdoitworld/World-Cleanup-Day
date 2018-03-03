import React, {Component} from 'react';
import {View, TouchableOpacity, Text, ScrollView,
    TextInput, Image, ImageBackground} from 'react-native';
import styles from './styles'
import strings from '../../../assets/strings'

export default class CreateEvent extends Component {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarTitleTextCentered: true,
    };

    constructor(props) {
        super(props);
        this.state = {text: ""}
    }

    render() {
        return (
            <View>
                <ScrollView style={styles.container}>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_title.toUpperCase()}</Text>
                    </View>
                    <View style={styles.inputContainerStyle}>
                        <TextInput style={styles.inputTextStyle}
                                   placeholder={strings.label_title_hint}
                                   underlineColorAndroid={'transparent'}
                                   autoCorrect={false}
                                   onChangeText={(text) => this.setState({text})}/>
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
                            <TouchableOpacity style={styles.dateAndTimeRowStyle}>
                                <Text style={styles.dateTitleTextStyle}>{strings.label_start}</Text>
                                <Text style={styles.dateTextStyle}>{strings.label_no_selected}</Text>
                            </TouchableOpacity>
                            <View style={styles.dividerStyle}/>
                            <TouchableOpacity style={styles.dateAndTimeRowStyle}>
                                <Text style={styles.dateTitleTextStyle}>{strings.label_end}</Text>
                                <Text style={styles.dateTextStyle}>{strings.label_no_selected}</Text>
                            </TouchableOpacity>
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
                        <TextInput style={styles.inputTextStyle}
                                   placeholder={strings.label_ignite_people_to_participate}
                                   underlineColorAndroid={'transparent'}
                                   autoCorrect={false}
                                   multiline={true}
                                   onChangeText={(text) => this.setState({text})}/>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_what_to_bring_with_you.toUpperCase()}</Text>
                    </View>
                    <View style={styles.descriptionContainerStyle}>
                        <TextInput style={styles.inputTextStyle}
                                   placeholder={strings.label_specify_tools_for_work}
                                   underlineColorAndroid={'transparent'}
                                   autoCorrect={false}
                                   multiline={true}
                                   onChangeText={(text) => this.setState({text})}/>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_cover_photo.toUpperCase()}</Text>
                    </View>
                    <View style={styles.eventPhotoContainerStyle}>
                        <ImageBackground/>

                    </View>
                </ScrollView>
            </View>)
    }

}