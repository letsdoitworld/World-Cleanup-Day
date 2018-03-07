import React, { Component } from 'react'
import { SearchBar } from './SearchBar'
import { EventDetails } from './EventDetails'
import { Event } from './Event'
import { NavLink, Switch, Router } from 'react-router-dom'
import { connect } from 'react-redux';
import './EventsList.css'
import { actions, selectors } from '../../reducers/events';

class EventsList extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { events, toggleEventWindow, eventId, history } = this.props;
    return (
      <div className="EventsList-container">
        <SearchBar onMinimizeClick={()=> toggleEventWindow()} history={history} event={eventId} />
        <div className={`EventsList-plot ${this.props.isOpened ? 'visible' : ''}`}>
          {
            !this.props.eventId ?
            events.map((ev)=> {
              return (
                <NavLink key={ev.datasetId} to={`/events/${ev.datasetId}`}>
                  <Event
                    avatar={ev.avatar}
                    title={ev.title}
                    author={ev.coordinator_name}
                    date={ev.createDate}
                    location={ev.address}
                    numberOfParticipants={ev.number_of_participants}
                  />
              </NavLink>
              )
            }) :
            <EventDetails eventId={eventId} />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=> ({
  events: selectors.getAllEvents(state),
  isOpened: selectors.getShowEventWindow(state)
});

const mapDispatchToProps = {
    toggleEventWindow: actions.toggleEventWindow
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsList)
