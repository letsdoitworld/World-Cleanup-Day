import React, { Component } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import strings  from '../../assets/strings';

import PropTypes from 'prop-types';

import { operations, selectors } from '../../reducers/app';
import Error from './ErrorModal';

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const composeErrorModal = () => (WrappedComponent) => {
  const ErrorModal = class extends Component {
    static propTypes = {
      message: PropTypes.string,
      title: PropTypes.string,
      visible: PropTypes.bool.isRequired,
      hideErrorMessage: PropTypes.func.isRequired,
      t: PropTypes.any.isRequired,
    };

    handleModalClosed = () => {
      this.props.hideErrorMessage();
    };

    render() {
      const { message, title, visible, t } = this.props;
      return (
        <View style={{ flex: 1 }}>
          <Modal
            animationType="fade"
            onRequestClose={this.handleModalClosed}
            transparent
            visible={visible}
          >
            <TouchableWithoutFeedback onPress={this.handleModalClosed}>
              <View style={styles.modalContainer}>
                <Error
                  title={title || t('label_error_modal_default_title')}
                  subtitle={message || t('label_error_modal_default_subtitle')}
                  buttonText={t('label_button_acknowledge')}
                  onPress={this.handleModalClosed}
                />
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <WrappedComponent {...this.props} />
        </View>
      );
    }
  };
  return translate()(ErrorModal);
};

const mapState = state => ({
  message: selectors.getErrorMessage(state),
  title: selectors.getErrorTitle(state),
  visible: selectors.isErrorVisible(state),
});
const mapDispatch = {
  hideErrorMessage: operations.hideErrorMessage,
};

export const withErrorModal = () =>
  compose(connect(mapState, mapDispatch), composeErrorModal());
