import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Header } from '../components/Header';
import { MarkersMap } from '../components/MarkersMap';

import {
  selectors as trashpileSelectors,
  actions as trashpileActions,
} from '../reducers/trashpile';
import { Details } from '../components/Details';
import './Landing.css';

class Landing extends Component {
  constructor() {
    super();
    this.state = {
      showDetails: false,
    };
  }

  onMarkerClick = marker => {
    if (marker.count) {
      return;
    }
    this.setState(
      {
        showDetails: true,
      },
      () => {
        this.props.fetchMarkerDetails(marker.id);
      },
    );
  };

  handleCloseDetails = () => {
    this.setState({
      showDetails: false,
    });
  };

  actions = {
    onCloseDetailsClick: this.handleCloseDetails,
  };

  render() {
    const { markerDetails } = this.props;
    const sidebarDetailsClass = `Sidebar-details ${this.state.showDetails
      ? 'isOpen'
      : ''}`;
    return (
      <div className="Landing">
        <Header />
        <div className="Landing_content">
          <MarkersMap onMarkerClick={this.onMarkerClick} />
        </div>
        <div className={sidebarDetailsClass}>
          <Details marker={markerDetails} actions={this.actions} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  markers: trashpileSelectors.getAllMarkers(state),
  markerDetails: trashpileSelectors.getMarkerDetails(state),
});

const mapDispatchToProps = {
  fetchAllTrashpoints: trashpileActions.fetchAllMarkers,
  fetchMarkerDetails: trashpileActions.fetchMarkerDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
