import { TouchableOpacity, View, Text } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import BaseTrashpointEdit from './BaseTrashpointEdit';
import { MARKER_STATUSES } from '../../shared/constants';
import { AMOUNT_STATUSES } from '../../components/AmountPicker';
import styles from './styles';
import strings from '../../assets/strings';


class CreateMarker extends BaseTrashpointEdit {
  renderBottomComponents() {
    return <View style={styles.createTrashPointButtonContainer}>
      <TouchableOpacity
        onPress={this.handleCompleteAction}
        style={styles.confirmButton}
      >
        <Text style={styles.confirmButtonText}>
          {strings.label_button_createTP_confirm_create}
        </Text>
      </TouchableOpacity>
    </View>;
  }

    handleCompleteAction = () => {
      const {
        photos,
        trashCompositionTypes,
        hashtags,
        status = MARKER_STATUSES.REGULAR,
        amount,
        address,
        trashOrigins,
      } = this.state;
      const team = this.props.teamId;

      if (!this.validate()) {
        return;
      }

      const selectedTrashOrigin = [...trashOrigins
        .filter(t => t.selected).map(t => t.type)];

      this.setState((previousState) => {
        return {
          ...previousState,
          disableCreateTrashpointButton: true,
          isCreateButtonPressed: true,
        };
      }, () => {
        this.props.createTrashPointAction(
          [...hashtags.map(t => t.label)],
          [...trashCompositionTypes.filter(t => t.selected).map(t => t.type)],
          this.state.editableLocation,
          status,
          address,
          AMOUNT_STATUSES[amount],
          address,
          photos,
          selectedTrashOrigin,
          team,
        );
      });
    };

  handlePhotoDelete = (photo, index) => {
    const { photos } = this.state;
    photos.splice(index, 1);
    this.setState({
      photos,
    });
  };
}

CreateMarker.propTypes = {
  createTrashPointAction: PropTypes.func,
};

export default CreateMarker;
