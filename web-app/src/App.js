import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  actions as appActions,
  selectors as appSelectors,
} from './reducers/app';
import {
  actions as errorActions,
  selectors as errorSelectors,
} from './reducers/error';
import { actions as trashpileActions } from './reducers/trashpile';
import {
  selectors as userSelectors,
  actions as userActions,
} from './reducers/user';
import { persistStoreAsync } from './config/persist';
import store from './config/store';
import { Loader } from './components/Spinner';
import { ApiService } from './services/';

import { LockedModal } from './components/LockedModal';
import { ErrorModal } from './components/ErrorModal/ErrorModal';

import Router from './routes/index';

import './normalizer.css';
import './App.css';


class App extends Component {

  static propTypes = {
    fetchDatasets: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    toggleLockedModal: PropTypes.func.isRequired,
    lockedModalIsOpen: PropTypes.bool.isRequired,
    hideErrorModal: PropTypes.func.isRequired,
    showErrorModal: PropTypes.func.isRequired,
    isErrModalVisible: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string.isRequired,
  }

  constructor() {
    super();
    this.state = {
      appLoaded: false,
    };
  }

  async componentWillMount() {
    Promise.all([
      await this.props.fetchDatasets(),
      await persistStoreAsync({
        store,
        localStorage,
      }),
    ]).then(() => {
      const token = userSelectors.getUserToken(store.getState());
      if (token) {
        ApiService.setAuthToken(token);
        this.props.fetchProfile();
      }
      this.setState({ appLoaded: true });
    });
  }
  closeModal = () => {
    this.props.hideModal();
  };
  handleLockedModalClose = () => {
    this.props.toggleLockedModal(false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorMessage !== this.props.errorMessage) {
      this.props.showErrorModal();
    }
  }

  render() {
    const {
      lockedModalIsOpen,
      errorMessage,
      hideErrorModal,
      isErrModalVisible,
    } = this.props;

    if (!this.state.appLoaded) {
      return <Loader />;
    }

    return (
      <div className="App">
        <Router />
        <LockedModal
          isOpen={lockedModalIsOpen}
          onClick={this.handleLockedModalClose}
        />
        <ErrorModal
          hideModal={hideErrorModal}
          isVisible={isErrModalVisible}
          errorMessage={errorMessage}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: !!userSelectors.getUserToken(state),
  modalIsOpen: appSelectors.getShowModal(state),
  lockedModalIsOpen: appSelectors.getShowLockedModal(state),
  errorMessage: errorSelectors.getErrorMessage(state),
  isErrModalVisible: errorSelectors.getShowErrorModal(state),
});

const mapDispatchToProps = {
  fetchDatasets: appActions.fetchDatasets,
  hidePopover: appActions.hideLoginPopover,
  fetchAllMarkers: trashpileActions.fetchAllMarkers,
  hideModal: appActions.hideModal,
  showModal: appActions.showModal,
  fetchProfile: userActions.fetchProfile,
  toggleLockedModal: appActions.toggleLockedModal,
  hideErrorModal: errorActions.hideErrorModal,
  showErrorModal: errorActions.showErrorModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
