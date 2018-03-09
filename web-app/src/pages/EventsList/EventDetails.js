import React, { Component } from 'react';
import { connect } from 'react-redux';
import './EventDetails.css';
import demo from '../../assets/demo.png';
import { selectors } from '../../reducers/events';
import {
  LocationIcon,
  EventsIcon,
  ShareIcon,
  ParticipantsIcon,
  ReportIcon,
} from '../../components/common/Icons';

class EventDetails extends Component {

  componentWillMount() {
    this.props.fetchEventDetails(this.props.eventId);
  }
  
  render() {
    const { event } = this.props;
    return (
      <div className="EventDetails">
        <div className="EventDetails-cover">
          <img src={demo} alt="demo" />
        </div>
        <div className="EventDetails-plot">
          <div className="EventDetails-descr EventDetails-infoblock">
            <h2 className="EventDetails-header">Description</h2>
            <p>{event.description}</p>
          </div>
          <div className="Event-divider" />
          <div className="EventDetails-timing EventDetails-infoblock">
            <div className="EventDetails-width-50">
              <EventsIcon />
              <span className="EventDetails-date">{event.createDate}</span>
            </div>
            <div className="EventDetails-width-50">
              <span className="EventDetails-period">
                {`${event.event_start_time} - ${event.event_end_time}`}
              </span>
            </div>
          </div>
          <div className="Event-divider" />
          <div className="EventDetails-actions EventDetails-infoblock">
            <div className="EventDetails-width-50">
              <ReportIcon />
              <span className="EventDetails-report">Report event</span>
            </div>
            <div className="EventDetails-width-50">
              <ShareIcon />
              <span className="EventDetails-share">Share</span>
            </div>
          </div>
          <div className="Event-divider" />
          <div className="EventDetails-people EventDetails-infoblock">
            <ParticipantsIcon />
            max {event.number_of_participants}
          </div>
          <div className="Event-divider" />
          <div className="EventDetails-bring EventDetails-infoblock">
            <h2 className="EventDetails-header">What to bring</h2>
            {event.what_to_bring}
          </div>
          <div className="Event-divider" />
          <div className="EventDetails-location EventDetails-infoblock">
            <LocationIcon />
            <p>
              {`${event.address} | ${event.location_lat}, ${event.location_lon}`}
            </p>
          </div>
          <div className="Event-divider" />
          <div className="EventDetails-creator EventDetails-infoblock">
            <h2 className="EventDetails-header">Event creator</h2>
            <p>{event.coordinator_name}</p>
            <p>{event.email}</p>
          </div>
          <div className="Event-divider" />
          <div className="EventDetails-traspoints EventDetails-infoblock">
            <h2 className="EventDetails-header">Trashpoints</h2>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  event: selectors.getEventDetails(state),
});

export default connect(mapStateToProps)(EventDetails);
