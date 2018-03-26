import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import classnames from 'classnames';
import EventListHeader from './EventListHeader';
import { EventDetails } from './EventDetails';
import { Event } from './Event';
import './EventsList.css';
import { actions, selectors } from '../../reducers/events';
import {
  actions as appActions,
  selectors as appSelectors,
} from '../../reducers/app';

class EventsList extends Component {

  componentWillMount() {
    this.props.fetchEventsList({
      latitude: this.props.currentLocation.lat,
      longitude: this.props.currentLocation.lng,
    },
      5,
    );
    this.props.setActiveTab('events');
  }

  render() {
    const {
      events,
      toggleEventWindow,
      eventId,
      history,
      isOpened,
      fetchEventDetails,
    } = this.props;
    return (
      <div className="EventsList-container">
        <EventListHeader
          onMinimizeClick={() => toggleEventWindow()}
          history={history}
          eventId={eventId}
        />
      <div className={classnames('EventsList-plot', { 'visible': isOpened }) }>
          {
            !eventId ?
            events.map((ev) => {
              return (
                <NavLink key={ev.id} to={`/events/${ev.id}`}>
                  <Event
                    onClick={fetchEventDetails}
                    eventId={ev.id}
                    avatar={ev.avatar}
                    title={ev.name}
                    author={ev.email}
                    date={ev.startTime}
                    location={ev.address}
                    maxNumberOfParticipants={ev.maxPeopleAmount || 20}
                    numberOfParticipants={ev.peopleAmount}
                  />
                </NavLink>
              );
            }) :
            <EventDetails eventId={eventId} fetchEventDetails={fetchEventDetails} />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  events: selectors.getEventsList(state),
  isOpened: selectors.getShowEventWindow(state),
  currentLocation: appSelectors.getCurrentLocation(state),
});

const mapDispatchToProps = {
  toggleEventWindow: actions.toggleEventWindow,
  fetchEventsList: actions.fetchEventsList,
  fetchEventDetails: actions.fetchEventDetails,
  setActiveTab: appActions.setActiveTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsList);
