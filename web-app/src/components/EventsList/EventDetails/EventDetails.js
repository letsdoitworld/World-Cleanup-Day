import React from 'react';
import Swiper from 'react-id-swiper';
import * as moment from 'moment';
import './EventDetails.css';
import {
  LocationIconEvent,
  DateIcon,
  ShareIcon,
  ParticipantsIcon,
  ReportIcon,
  Userpic,
  EmailIcon,
  PhoneIcon,
  userpicHolder,
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

export const EventDetails = (props) => {
  const { eventDetails } = props;
  return (
    <div className="EventDetails">
      <div className="EventDetails-cover">
        <img
          src={eventDetails.photos[0] || userpicHolder}
          alt="demo"
        />
      </div>
      <div className="EventDetails-plot">
        <div className="EventDetails-timing EventDetails-infoblock">
          <div className="EventDetails-width-60">
            <DateIcon />
            <span className="EventDetails-date">
              {moment(eventDetails.startTime).format('L')}
            </span>
          </div>
          <div className="EventDetails-width-40">
            <span className="EventDetails-period">
              {`${moment(eventDetails.startTime).format('LT')} - ${moment(eventDetails.endTime).format('LT')}`}
            </span>
          </div>
        </div>
        <div className="EventDetails-location EventDetails-infoblock">
          <LocationIconEvent />
          <p className="EventDetails-location-address">
            {`${eventDetails.address} | ${eventDetails.location.latitude}, ${eventDetails.location.longitude}`}
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
          <p>{eventDetails.description}</p>
        </div>
        <div className="EventDetails-bring EventDetails-infoblock">
          <h2 className="EventDetails-header">What to bring</h2>
          {eventDetails.whatToBring}
        </div>
        <div className="EventDetails-coordinator EventDetails-infoblock">
          <h2 className="EventDetails-header">Coordinator</h2>
          <div className="EventDetails-coordinator-part">
            <Userpic />
            <p>{eventDetails.createdByName}</p>
          </div>
          <div className="EventDetails-coordinator-part">
            <PhoneIcon />
            <p>{+380010050000}</p>
          </div>
          <div className="EventDetails-coordinator-part">
            <EmailIcon />
            <p>{eventDetails.email}</p>
          </div>
        </div>
        <div className="EventDetails-creator EventDetails-infoblock">
          <h2 className="EventDetails-header">Event creator</h2>
          <div className="EventDetails-creator-part">
            <Userpic />
            <p>{eventDetails.createdByName}</p>
          </div>
        </div>
        <div className="EventDetails-attend EventDetails-infoblock">
          <h2 className="EventDetails-header">Attendees</h2>
          <div className="EventDetails-attend-part">
            <ParticipantsIcon />
            <p>
              {eventDetails.peopleAmount}/{eventDetails.maxPeopleAmount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
