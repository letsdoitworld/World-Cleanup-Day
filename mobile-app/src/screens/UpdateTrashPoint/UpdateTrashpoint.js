import { Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import React from 'react';
import BaseTrashpointEdit from '../CreateMarker/BaseTrashpointEdit';
import styles from './styles';
import strings from '../../assets/strings';
import { MARKER_STATUSES } from '../../shared/constants';
import { AMOUNT_STATUSES } from '../../components/AmountPicker';

const HOUR_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export default class UpdateTrashpoint extends BaseTrashpointEdit {
    timeoutDelete;
    timezoneOffset = new Date().getTimezoneOffset();
    localizedTime = moment().utcOffset(Math.abs(this.timezoneOffset));

    constructor(props) {
      super(props);
      const hoursFromCreation = this.localizedTime
        .diff(moment(props.trashPoint.createdAt), 'hours');
      const isMyTrashPoint = props.profile &&
        props.trashPoint.creator.id === props.profile.id;
      this.state.isDeleteVisible = hoursFromCreation < 24 && isMyTrashPoint;
    }

    componentDidMount() {
      if (this.state.isDeleteVisible) {
        const timeLeftTillDelete = HOUR_IN_MILLISECONDS - this.localizedTime
          .diff(moment(this.props.trashPoint.createdAt), 'milliseconds');

        this.timeoutDelete = setTimeout(() => {
          this.setState({ isDeleteVisible: false });
        },
        timeLeftTillDelete,
        );
      }
    }

    renderBottomComponents() {
      return <View style={styles.controlsContainer}>
        <View style={styles.buttonsContainer}>
          {this.renderUpdateButton()}
          {this.renderDeleteButton()}
        </View>
      </View>;
    }

    renderUpdateButton() {
      return this.props.shouldShowUpdate ?
        <TouchableOpacity
          onPress={this.handleCompleteAction}
          style={styles.updateButton}
        >
          <Text style={styles.updateButtonText}>
            {strings.label_update}
          </Text>
        </TouchableOpacity>
        : null;
    }

    renderDeleteButton() {
      return this.state.isDeleteVisible ?
        <TouchableOpacity
          onPress={this.handleDeletetAction}
          style={styles.deleteButton}
        >
          <Text style={styles.updateButtonText}>
            {strings.label_button_delete}
          </Text>
        </TouchableOpacity>
        : null;
    }


    componentWillUnmount() {
      // eslint-disable-next-line no-undef
      window.clearTimeout(this.timeoutDelete);
    }

    handleDeletetAction = async () => {
      this.props.deleteTrashPointAction(
        this.props.trashPoint.id,
      );
    };

  handleCompleteAction = () => {
    const {
      photos,
      trashCompositionTypes,
      hashtags,
      status = MARKER_STATUSES.REGULAR,
      amount,
      address,
      trashOrigins } = this.state;

    if (!this.validate()) {
      return;
    }

    const selectedTrashOrigin = trashOrigins
      ? [...trashOrigins.filter(t => t.selected).map(t => t.type)] : null;

    this.setState((previousState) => {
      return {
        ...previousState,
        disableCreateTrashpointButton: true,
        isCreateButtonPressed: true,
      };
    }, () => {
      this.props.updateTrashPointAction(
        this.props.trashPoint.id,
        hashtags && [...hashtags.map(t => t.label)],
        [...trashCompositionTypes.filter(t => t.selected).map(t => t.type)],
        this.state.editableLocation,
        status,
        address,
        AMOUNT_STATUSES[amount],
        address,
        photos,
        null,
        selectedTrashOrigin,
      );
    });
  };

  handlePhotoDelete = async (photo, index) => {
    try {
      await this.props.deleteTrashPointImageAction(this.props.trashPoint.id, photo.id);
      const { photos, initialPhotos } = this.state;
      if (photos[index]) {
        photos.splice(index, 1);
      } else {
        const initialIndex = initialPhotos
          .findIndex(initialPhoto => initialPhoto.id === photo.id);
        initialPhotos.splice(initialIndex, 1);
      }
      this.setState({
        photos,
        initialPhotos,
      });
    } catch (e) {
      console.log(e);
    }
  };
}
