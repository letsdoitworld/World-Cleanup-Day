import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swiper from 'react-id-swiper';
import './EventDetails.css';
import { selectors } from '../../../reducers/events';
import {
  LocationIconEvent,
  DateIcon,
  ShareIcon,
  ParticipantsIcon,
  ReportIcon,
  Userpic,
  EmailIcon,
  PhoneIcon,
} from '../../../components/common/Icons';
import demo from '../../../assets/demo.png';


const swiperOptions = {
  slidesPerView: 2,
  spaceBetween: 40,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
};

class EventDet extends Component {

  componentWillMount() {
    this.props.fetchEventDetails(this.props.eventId);
  }

  componentWillReceiveProps(nextProps) {
    this.props.fetchEventDetails(nextProps.eventId);
  }

  render() {
    const { event, eventId } = this.props;

    return (
      <div className="EventDetails">
        <div className="EventDetails-cover">
          <img src={event.avatar} alt="demo" />
        </div>
        <div className="EventDetails-plot">
          <div className="EventDetails-timing EventDetails-infoblock">
            <div className="EventDetails-width-60">
              <DateIcon />
              <span className="EventDetails-date">{event.createDate}</span>
            </div>
            <div className="EventDetails-width-40">
              <span className="EventDetails-period">
                {`${event.event_start_time} - ${event.event_end_time}`}
              </span>
            </div>
          </div>
          <div className="EventDetails-location EventDetails-infoblock">
            <LocationIconEvent />
            <p className="EventDetails-location-address">
              {`${event.address} | ${event.location_lat}, ${event.location_lon}`}
            </p>
          </div>
          <div className="EventDetails-actions EventDetails-infoblock">
            <div className="EventDetails-actions-part EventDetails-width-60">
              <ReportIcon />
              <span className="EventDetails-report">Report event</span>
            </div>
            <div className="EventDetails-actions-report EventDetails-width-40">
              <ShareIcon />
              <span className="EventDetails-share">Share</span>
            </div>
          </div>
          <div className="EventDetails-trashpoints EventDetails-infoblock">
            <h2 className="EventDetails-header">Trashpoints</h2>
            <Swiper {...swiperOptions}>
              <div className="EventDetails-trashpoints-item">
                <img className="EventDetails-trashpoints-item-img" src={demo} alt="demo" />
                <br />
                <span className="EventDetails-trashpoints-item-title">Some trashpoint</span>
              </div>
              <div className="EventDetails-trashpoints-item">
                <img className="EventDetails-trashpoints-item-img" src={demo} alt="demo" />
                <br />
                <span className="EventDetails-trashpoints-item-title">Some trashpoint</span>
              </div>
              <div className="EventDetails-trashpoints-item">
                <img className="EventDetails-trashpoints-item-img" src={demo} alt="demo" />
                <br />
                <span className="EventDetails-trashpoints-item-title">Some trashpoint</span>
              </div>
              <div className="EventDetails-trashpoints-item">
                <img className="EventDetails-trashpoints-item-img" src={demo} alt="demo" />
                <br />
                <span className="EventDetails-trashpoints-item-title">Some trashpoint</span>
              </div>
              <div className="EventDetails-trashpoints-item">
                <img className="EventDetails-trashpoints-item-img" src={demo} alt="demo" />
                <br />
                <span className="EventDetails-trashpoints-item-title">Some trashpoint</span>
              </div>
              <div className="EventDetails-trashpoints-item">
                <img className="EventDetails-trashpoints-item-img" src={demo} alt="demo" />
                <br />
                <span className="EventDetails-trashpoints-item-title">Some trashpoint</span>
              </div>
              <div className="EventDetails-trashpoints-item">
                <img className="EventDetails-trashpoints-item-img" src={demo} alt="demo" />
                <br />
                <span className="EventDetails-trashpoints-item-title">Some trashpoint</span>
              </div>
            </Swiper>
          </div>
          <div className="EventDetails-descr EventDetails-infoblock">
            <h2 className="EventDetails-header">Description</h2>
            <p>{event.description}</p>
          </div>
          <div className="EventDetails-bring EventDetails-infoblock">
            <h2 className="EventDetails-header">What to bring</h2>
            {event.what_to_bring}
          </div>
          <div className="EventDetails-coordinator EventDetails-infoblock">
            <h2 className="EventDetails-header">Coordinator</h2>
            <div className="EventDetails-coordinator-part">
              <Userpic />
              <p>{event.coordinator_name}</p>
            </div>
            <div className="EventDetails-coordinator-part">
              <PhoneIcon />
              <p>{+380010050000}</p>
            </div>
            <div className="EventDetails-coordinator-part">
              <EmailIcon />
              <p>{event.email}</p>
            </div>
          </div>
          <div className="EventDetails-creator EventDetails-infoblock">
            <h2 className="EventDetails-header">Event creator</h2>
            <div className="EventDetails-creator-part">
              <Userpic />
              <p>{event.coordinator_name}</p>
            </div>
          </div>
          <div className="EventDetails-attend EventDetails-infoblock">
            <h2 className="EventDetails-header">Attendees</h2>
            <div className="EventDetails-attend-part">
              <ParticipantsIcon />
              <p>
                {event.number_of_participants - 2}/{event.number_of_participants}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  event: selectors.getEventDetails(state),
});

export const EventDetails = connect(mapStateToProps)(EventDet);
