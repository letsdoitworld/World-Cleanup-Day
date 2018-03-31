import React, {Component} from 'react';
import {MessageBarManager} from 'react-native-message-bar';
import {
    BackHandler,
    StatusBar,
    View,
    ScrollView,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    //   LinearGradient,
    TouchableHighlight, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import strings from '../../assets/strings';

import {operations as appOps, selectors as appSels} from '../../reducers/app/operations';


import {withCameraActions} from '../../services/Camera';
import ImageService from '../../services/Image';
import {withLoadingScreen} from '../../services/Loading';
import {operations as locationOperations} from '../../reducers/location/operations';
import {Button} from '../../components/Button';
import LocationPicker from './components/LocationPicker/LocationPicker';
import StatusPicker from './components/StatusPicker/StatusPicker';
import {PhotoPicker} from '../../components/PhotoPicker';
import {Divider} from '../../components';
import {getWidthPercentage, getHeightPercentage, handleSentryError} from '../../shared/helpers';
import {Tags} from '../../components/Tags';
import {AmountPicker, AMOUNT_STATUSES} from '../../components/AmountPicker';
import {AlertModal} from '../../components/AlertModal';
import {CustomSlider} from '../../components/CustomSlider';
import {
    TRASH_COMPOSITION_TYPE_LIST,
    MARKER_STATUSES,
    AMOUNT_HASH, DEFAULT_ZOOM,
} from '../../shared/constants';
import {
    // operations as trashpileOperations,
    createMarker
} from '../../reducers/trashpile/operations';
import {

    selectors as trashpileSelectors,
} from '../../reducers/trashpile/selectors';
import _ from 'lodash';
import styles from './styles';
import CongratsModal from "./components/CongratsModal/CongratsModal";
import {createTrashPointAction} from "../../store/actions/trashPoints";
import {createStructuredSelector} from "reselect";
import {getTrashPointsEntity, isLoading} from "../../store/selectors";
import AddTrashPoints from "../AddTrashPoints/AddTrashPoints";
import {geocodeCoordinates, getCurrentPosition} from "../../shared/geo";
import {ADD_LOCATION} from "../index";
import ImagePicker from "react-native-image-crop-picker";
import TrashAmountLevel from "../../components/TrashAmountLevel/TrashAmountLevel";
//import { NavigationActions } from 'react-navigation'

const ALERT_CHECK_IMG = require('./alert_check.png');

const HANDFUL_IMAGE_DATA = {
    default: require('../../components/AmountPicker/images/icon_handful_blue_outline.png'),
    active: require('../../components/AmountPicker/images/icon_handful_blue_fill.png'),
};
const BAGFUL_IMAGE_DATA = {
    default: require('../../components/AmountPicker/images/icon_bagful_blue_outline.png'),
    active: require('../../components/AmountPicker/images/icon_bagful_blue_fill.png'),
};
const CARTLOAD_IMAGE_DATA = {
    default: require('../../components/AmountPicker/images/icon_cartload_blue_outline.png'),
    active: require('../../components/AmountPicker/images/icon_cartload_blue_fill.png'),
};
const TRUCKLOAD_IMAGE_DATA = {
    default: require('../../components/AmountPicker/images/icon_truck_blue_outline.png'),
    active: require('../../components/AmountPicker/images/icon_truck_blue_fill.png'),
};

const MAX_HASHTAGS_NO = 15;
const GRADIENT_COLORS = ['#FFFFFF', '#F1F1F1'];
const PADDING_SIZE20 = getWidthPercentage(20);
const HEIGHT_SIZE15 = getHeightPercentage(15);
const HEIGHT_SIZE20 = getHeightPercentage(20);

const cancelId = 'cancelId';

class CreateMarker extends React.Component {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarTitleTextCentered: true,
        navBarBackgroundColor: 'white',
        navBarTextColor: '$textColor',
        navBarTextFontSize: 17,
        navBarTextFontFamily: 'Lato-Bold',
        statusBarColor: 'white',
        statusBarTextColorScheme: 'dark',
    };

    static navigatorButtons = {
        leftButtons: [
            {
                icon: require('../../../src/assets/images/icons/ic_back.png'),
                id: cancelId,
            }
        ]

    };

    constructor(props) {
        super(props);

        const {photos, coords} = props;

        const state = {
            photos: [...photos],
            temporaryHashtag: '',
            amount: AMOUNT_STATUSES.handful,
            status: MARKER_STATUSES.REGULAR,
            congratsShown: false,
            trashCompositionTypes: TRASH_COMPOSITION_TYPE_LIST.map(
                trashCompositionType => ({
                    ...trashCompositionType,
                    selected: false,
                }),
            ),
            hashtags: [],
            initialLocation: coords,
            editableLocation: coords,
            address: {},
            disableCreateTrashpointButton: false,
            locationSetByUser: false,
        };

        this.state = state;

        this.closeValidationButton = {
            text: strings.label_button_acknowledge,
            onPress: this.hideValidation,
        };

        this.congratsTimeout = setTimeout(() => {
            if (!this.state.congratsShown) {
                this.setState({congratsShown: true});
            }
            this.congratsTimeout = undefined;
        }, 4000);

        this.handleBackPress = this.handleBackPress.bind(this);
        this.handleTrashpointCreate = _.debounce(
            this.handleTrashpointCreate,
            2000,
            {
                leading: true,
                trailing: false,
            },
        );

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            switch (event.id) {
                case cancelId: {
                    this.props.navigator.pop();
                    break;
                }
            }
        }
    }

    async componentWillMount() {
        await this.fetchAddressAsync();

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillReceiveProps(nextProps) {
        const {isConnected: wasConnected} = this.props;
        const {isConnected} = nextProps;
        const {address, locationSetByUser} = this.state;
        if (!wasConnected && isConnected && !locationSetByUser &&
            (!address || !address.completeAddress)) {
            this.fetchAddressAsync();
        }

        if (this.props.createTrashPoint.success) {
            this.props.navigator.pop()
        }

        // if (this.props.createTrashPoint.success) {
        //     this.props.navigation.pop()
        // }

        //    console.log(this.props.createTrashPoint)
        //    console.log('this.props.createTrashPoint')

    }

    fetchAddressAsync = async (coords) => {
        const place = await geocodeCoordinates(coords || this.state.initialLocation);
        this.setState(previousState => {
            return {
                ...previousState,
                address: place.mainText
            };
        });
    };

    showValidation = (text) => {
        this.setState({
            validation: true,
            validationText: text,
        });
    };
    hideValidation = () => {
        this.setState({
            validation: false,
        });
    };

    handleBackPress() {
        // const { navigation } = this.props;
        // navigation.dispatch(NavigationActions.reset({
        //   index: 0,
        //   actions: [NavigationActions.navigate({ routeName: 'Tabs' })]
        // }));
        return true;
    }

    handleEditLocationPress = () => {
        const {initialLocation, status, address} = this.state;
        this.props.navigator.push({
            screen: ADD_LOCATION,
            title: strings.label_header_edit_loc,
            passProps: {
                initialLocation,
                onLocationSelected: this.onLocationSelected.bind(this),
            }
        });
    };

    onLocationSelected(location) {
        this.setState(previousState => {
            return {
                ...previousState,
                editableLocation: {
                    latitude: location.latitude,
                    longitude: location.longitude
                },
                address: location.place
            };
        });
    }

    handlePhotoAdd = async () => {

        const image = await ImagePicker.openCamera({
            compressImageQuality: 0.2,
            cropping: true,
            includeBase64: true
        });
        const {width, height, data, path} = image;
        const uri = path;

        const thumbnailBase64 = await ImageService.getResizedImageBase64({
            uri,
            width,
            height
        });

        this.setState(previousState => {
            return {
                ...previousState,
                photos: [...previousState.photos, {uri, base64: data, thumbnail: {base64: thumbnailBase64}},],
            };
        });
    };

    handlePhotoDelete = (index) => {
        const {photos} = this.state;
        photos.splice(index, 1);
        this.setState({
            photos,
        });
    };

    handleTrashCompositionTypeSelect = index => () => {
        const selectedTag = this.state.trashCompositionTypes[index];
        this.setState({
            trashCompositionTypes: [
                ...this.state.trashCompositionTypes.slice(0, index),
                {...selectedTag, selected: !selectedTag.selected},
                ...this.state.trashCompositionTypes.slice(index + 1),
            ],
        });
    };

    handleHashtagDelete = index => () => {
        this.setState({
            hashtags: [
                ...this.state.hashtags.slice(0, index),
                ...this.state.hashtags.slice(index + 1),
            ],
        });
    };

    validate() {
        const {photos, trashCompositionTypes} = this.state;
        if (
            !photos ||
            photos.length === 0 ||
            !trashCompositionTypes.find(type => type.selected)
        ) {
            this.showValidation(strings.label_error_saveTP_pic_and_type);
            return false;
        }
        return true;
    }

    handleTrashpointCreate = () => {
        // const {createMarker, navigation, setErrorMessage, t} = this.props;
        const {
            photos,
            trashCompositionTypes,
            hashtags,
            status = MARKER_STATUSES.REGULAR,
            amount,
            address,
        } = this.state;

        if (!this.validate()) {
            return;
        }

        this.setState({disableCreateTrashpointButton: true}, () => {
            // console.log(" " + status + "  " + amount + ' ' + this.state.editableLocation + "  " + completeAddress)

            this.props.createTrashPointAction(
                [...hashtags.map(t => t.label)],
                [...trashCompositionTypes.filter(t => t.selected).map(t => t.type)],
                this.state.editableLocation,
                status,
                address,
                AMOUNT_STATUSES[amount],
                address,
                photos,
            );

        });
    };

    showSuccessAlert = () => {
        MessageBarManager.showAlert({
            title: this.props.t('label_alert_createTP_success'),
            alertType: 'success',
            avatar: ALERT_CHECK_IMG,
            duration: 4000,
            viewTopInset: Platform.select({
                android: StatusBar.currentHeight,
                ios: 15,
            }),
            stylesheetSuccess: {
                strokeColor: 'transparent',
                backgroundColor: '#3e8ede',
                width: getWidthPercentage(320),
                height: getHeightPercentage(50),
            },
            titleStyle: {
                color: 'white',
                fontSize: 15,
                // fontFamily: 'noto-sans-bold',
            },
        });
    };

    handleStatusChanged = (status) => {
        this.setState({
            status,
        });
    };

    handleAddHahstag = () => {
        const {hashtags, temporaryHashtag, trashCompositionTypes} = this.state;

        if (hashtags.length === MAX_HASHTAGS_NO) {
            return;
        }

        let labels = temporaryHashtag.replace(/[^0-9a-z,]/gi, '').split(',');

        if (labels.length === 1 && labels[0] === '') {
            return;
        }

        labels = labels.map(label => `#${label}`);

        labels = _.difference(labels, hashtags.map(hashtag => hashtag.label));

        if (labels.length === 0) {
            return this.setState({
                temporaryHashtag: '',
            });
        }

        this.setState({
            //  hashtags: [...hashtags, ...labels.map(label => ({label}))],
            temporaryHashtag: '',
            trashCompositionTypes: [...trashCompositionTypes, ...labels.map(label => ({label, selected: true}))]
        });
    };

    handleChangeHashtagText = (text) => {
        this.setState({temporaryHashtag: text});
    };

    handleAmountSelect = (amount) => {
        this.setState({
            amount,
        });
    };

    markCongratsShown = () => {
        this.setState(previousState => {
            return {
                ...previousState,
                congratsShown: true,
            };
        });
        if (this.congratsTimeout) {
            clearTimeout(this.congratsTimeout);
            this.congratsTimeout = undefined;
        }
    };

    render() {
        const {
            photos,
            trashCompositionTypes,
            status,
            hashtags,
            temporaryHashtag,
            amount = AMOUNT_STATUSES.handful,
            validation = false,
            validationText,
            congratsShown,
            initialLocation,
            editableLocation,
            address = {},
            disableCreateTrashpointButton
        } = this.state;
        const addHashtagTextStyle = {};
        if (hashtags.length === MAX_HASHTAGS_NO) {
            addHashtagTextStyle.color = GRADIENT_COLORS[1];
        }
        if (!congratsShown) {
            return <CongratsModal onContinuePress={this.markCongratsShown.bind(this)}/>;
        }
        const label = {
            textAlign: 'center',
            fontFamily: 'Lato-Bold',
            fontSize: 12,
            color: 'rgb(123, 125, 128)',
            letterSpacing: 0.4
        };
        return (
            <ScrollView style={{backgroundColor: 'white'}}>
                <AlertModal
                    visible={validation}
                    title={strings.label_error_saveTP_subtitle}
                    subtitle={validationText}
                    buttons={[this.closeValidationButton]}
                    onOverlayPress={this.hideValidation}
                />
                <LocationPicker
                    onEditLocationPress={this.handleEditLocationPress}
                    value={editableLocation}
                    address={address}
                    status={status}
                />
                {this.renderSectionHeader(strings.label_point_status_header)}
                <StatusPicker
                    value={status}
                    onChange={this.handleStatusChanged}
                />
                {this.renderSectionHeader(strings.label_text_select_trash_amount)}
                <View style={{
                    height: 110,
                    backgroundColor: 'rgb(216, 216, 216)',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}>
                    <CustomSlider
                        paddingHorizontal={20}
                        maximumValue={3}
                        step={1}
                        onValueChange={this.handleAmountSelect}
                        gradationData={[{
                            image: amount >= 0
                                ? HANDFUL_IMAGE_DATA.active
                                : HANDFUL_IMAGE_DATA.default,
                            text:
                                <Text
                                    key={strings.label_handful}
                                    style={[label, amount >= 0 ? {color: 'rgb(0, 143, 223)'} : {}]}>
                                    {strings.label_handful}
                                </Text>
                        }, {
                            image: amount >= 1
                                ? BAGFUL_IMAGE_DATA.active
                                : BAGFUL_IMAGE_DATA.default,
                            text:
                                <Text
                                    key={strings.label_bagful}
                                    style={[label, amount >= 1 ? {color: 'rgb(0, 143, 223)'} : {}]}>
                                    {strings.label_bagful}
                                </Text>
                        }, {
                            image: amount >= 2
                                ? CARTLOAD_IMAGE_DATA.active
                                : CARTLOAD_IMAGE_DATA.default,
                            text:
                                <Text
                                    key={strings.label_cartload}
                                    style={[label, amount >= 2 ? {color: 'rgb(0, 143, 223)'} : {}]}>
                                    {strings.label_cartload}
                                </Text>
                        }, {
                            image: amount >= 3
                                ? TRUCKLOAD_IMAGE_DATA.active
                                : TRUCKLOAD_IMAGE_DATA.default,
                            text:
                                <Text
                                    key={strings.label_truck}
                                    style={[label, amount >= 3 ? {color: 'rgb(0, 143, 223)'} : {}]}>
                                    {strings.label_truck}
                                </Text>
                        }]}
                    />
                </View>
                {this.renderSectionHeader(strings.label_select_trash_type)}
                <Tags
                    tags={trashCompositionTypes}
                    onTagSelect={this.handleTrashCompositionTypeSelect.bind(this)}
                />
                {this.renderSectionHeader(strings.label_add_additional_tags)}
                <View style={{
                    height: 44,
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <TextInput
                        style={styles.hashtagInput}
                        placeholderStyle={styles.hashtagInputPlaceholder}
                        placeholder={strings.label_text_createTP_add_hashtags_hint}
                        onChangeText={this.handleChangeHashtagText.bind(this)}
                        value={temporaryHashtag}
                        underlineColorAndroid="transparent"
                        maxLength={25}
                        onSubmitEditing={this.handleAddHahstag.bind(this)}
                    />
                </View>
                {this.renderSectionHeader(strings.label_text_createTP_add_photos.toLocaleUpperCase())}
                <View>
                    <PhotoPicker
                        maxPhotos={3}
                        photos={photos.map(({uri}) => uri)}
                        onDeletePress={this.handlePhotoDelete.bind(this)}
                        onAddPress={this.handlePhotoAdd.bind(this)}
                    />
                </View>
                <TouchableOpacity
                    onPress={this.handleTrashpointCreate.bind(this)}
                    style={styles.confirmButton}
                >
                    <Text style={styles.confirmButtonText}>
                        {strings.label_button_createTP_confirm_create}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }

    renderSectionHeader(text) {
        return (
            <Text style={styles.headerSection}>
                {text}
            </Text>
        );
    }
}

export default CreateMarker

