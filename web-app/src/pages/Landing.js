import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MarkersMap } from '../components/MarkersMap';
import { Terms } from '../components/Terms';
import { Privacy } from '../components/Privacy';
import { BinIcon, EventsIcon } from '../components/common/Icons';

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

  renderTermsRoute = () => <Terms />;
  renderPrivacyRoute = () => <Privacy />;
  renderNormalRoute = ()=>
    (<div className="Landing_content">
      <MarkersMap onMarkerClick={this.onMarkerClick}/>
      <div className={`Sidebar-details ${this.state.showDetails ? 'isOpen': ''}`}>
        <Details marker={this.props.markerDetails} actions={this.actions} />
      </div>
    </div>)

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
    const HEADER_LINKS = [
      { title: 'Events', url: '/events', image: <EventsIcon /> },
      { title: 'Trashpoints', url: '/trashpoints', image: <BinIcon /> }
    ];
    return (
      <div className="Landing">
        <Header links={HEADER_LINKS}/>
        <Switch>
          <Route path="/terms" render={this.renderTermsRoute} />
          <Route path="/privacy" render={this.renderPrivacyRoute} />
          <Route path="/" render={this.renderNormalRoute} />
        </Switch>
        <Footer />
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
