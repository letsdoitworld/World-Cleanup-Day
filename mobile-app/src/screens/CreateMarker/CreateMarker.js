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
    TouchableHighlight,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import strings from '../../assets/strings';

import ImageService from '../../services/Image';
import LocationPicker from './components/LocationPicker/LocationPicker';
import StatusPicker from './components/StatusPicker/StatusPicker';
import {PhotoPicker} from '../../components/PhotoPicker';
import {getWidthPercentage, getHeightPercentage} from '../../shared/helpers';
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
import {geocodeCoordinates} from "../../shared/geo";
import ImagePicker from "react-native-image-crop-picker";
import {ADD_LOCATION, CREATE_MARKER} from "../index";

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
            style: {
                marginHorizontal: 30
            }
        };

        this.congratsTimeout = setTimeout(() => {
            if (!this.state.congratsShown) {
                this.setState({congratsShown: true});
            }
            this.congratsTimeout = undefined;
        }, 4000);
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
            this.fetchAddressAsync().catch()
        }

        if (this.props.createTrashPoint.success) {
            Alert.alert(
                strings.label_thank_you_for_contr,
                strings.label_add_more_trashpoints,
                [
                    {text: strings.label_button_cancel, onPress: () => {this.props.navigator.pop()}, style: 'cancel'},
                    {text: strings.label_add, onPress: () => {
                        this.props.navigator.resetTo({
                            screen: CREATE_MARKER,
                            title: strings.label_button_createTP_confirm_create,
                            passProps: {
                                photos: this.props.photos,
                                coords: this.props.coords,
                            }
                        })}},
                ],
                { cancelable: false }
           )
        }

        if (this.props.createTrashPoint.error) {
            alert(this.props.createTrashPoint.error)
        }
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
        if (!photos
            || photos.length === 0
            || !trashCompositionTypes.find(type => type.selected)
        ) {
            this.showValidation(strings.label_error_saveTP_pic_and_type);
            return false;
        }
        return true;
    }

    handleTrashpointCreate = () => {
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
            hashtags: [...hashtags, ...labels.map(label => ({label}))],
            temporaryHashtag: '',
            // trashCompositionTypes: [...trashCompositionTypes, ...labels.map(label => ({label, selected: true}))]
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
        return (
            <ScrollView
                pointerEvents={this.isProgressEnabled() ? 'none' : 'auto'}
                style={styles.scrollView}>
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
                <View style={styles.selectTrashPointTypeContainer}>
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
                                    style={[styles.label, amount >= 0 ? {color: 'rgb(0, 143, 223)'} : {}]}>
                                    {strings.label_handful}
                                </Text>
                        }, {
                            image: amount >= 1
                                ? BAGFUL_IMAGE_DATA.active
                                : BAGFUL_IMAGE_DATA.default,
                            text:
                                <Text
                                    key={strings.label_bagful}
                                    style={[styles.label, amount >= 1 ? {color: 'rgb(0, 143, 223)'} : {}]}>
                                    {strings.label_bagful}
                                </Text>
                        }, {
                            image: amount >= 2
                                ? CARTLOAD_IMAGE_DATA.active
                                : CARTLOAD_IMAGE_DATA.default,
                            text:
                                <Text
                                    key={strings.label_cartload}
                                    style={[styles.label, amount >= 2 ? {color: 'rgb(0, 143, 223)'} : {}]}>
                                    {strings.label_cartload}
                                </Text>
                        }, {
                            image: amount >= 3
                                ? TRUCKLOAD_IMAGE_DATA.active
                                : TRUCKLOAD_IMAGE_DATA.default,
                            text:
                                <Text
                                    key={strings.label_truck}
                                    style={[styles.label, amount >= 3 ? {color: 'rgb(0, 143, 223)'} : {}]}>
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
                <View style={styles.additionalTagsContainer}>
                    <TextInput
                        style={styles.hashtagInput}
                        placeholderStyle={styles.hashtagInputPlaceholder}
                        placeholder={strings.label_text_createTP_add_hashtags_hint}
                        onChangeText={this.handleChangeHashtagText.bind(this)}
                        value={temporaryHashtag}
                        underlineColorAndroid="transparent"
                        maxLength={25}
                    />
                    <TouchableOpacity
                        disabled={this.state.temporaryHashtag.length === 0}
                        onPress={this.handleAddHahstag.bind(this)}>
                        <Text style={[styles.addButton, this.state.temporaryHashtag.length > 0 ? {} : {color: 'rgb(126, 124, 132)' }]}>
                            {strings.label_add}
                        </Text>
                    </TouchableOpacity>
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
                <View style={styles.createTrashPointButtonContainer}>
                    <TouchableOpacity
                        onPress={this.handleTrashpointCreate.bind(this)}
                        style={styles.confirmButton}
                    >
                        <Text style={styles.confirmButtonText}>
                            {strings.label_button_createTP_confirm_create}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    isProgressEnabled() {
        return this.props.isLoading;
    }

    renderProgress() {
        if (this.isProgressEnabled()) {
            return this.spinner();
        }
        return null;
    }

    spinner() {
        return (
            <ActivityIndicator
                style={styles.spinner}
                size="large"
                color="rgb(0, 143, 223)"
            />
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

