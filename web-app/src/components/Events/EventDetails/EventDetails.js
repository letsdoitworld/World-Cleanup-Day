import React from 'react';
import { NavLink } from 'react-router-dom';
import { If, Else } from 'react-if';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import 'moment/locale/en-au';
import './EventDetails.css';
import { Loader } from '../../Spinner';
import {
  LocationIconEvent,
  DateIcon,
  ShareIcon,
  ParticipantsIcon,
  ReportIcon,
  Userpic,
  EmailIcon,
  PhoneIcon,
  eventCoverBig,
  RubbishIconActive,
} from '../../common/Icons';
import ShareModal from '../../ShareModal/ShareModal';

export const Details = ({
  eventDetails,
  showShareModal,
  isLoading,
  isShareModaVisible,
}) => {
  moment.locale('en-au');
  return (
    <If condition={!isLoading}>
      <div className="EventDetails">
        {
          isShareModaVisible &&
          <ShareModal
            header="Share event"
            url={`${window.location.origin}/event/${eventDetails.id}`}
            image={(eventDetails.photos && eventDetails.photos[0]) || eventCoverBig}
            title={eventDetails.name}
            description={eventDetails.description}
          />
        }
        <div
          className="EventDetails-cover"
          style={{
            backgroundImage: `url(${(eventDetails.photos && eventDetails.photos[0]) || eventCoverBig})`,
          }}
        />
        <div className="EventDetails-plot">
          <div className="EventDetails-timing EventDetails-infoblock">
            <div className="EventDetails-width-55">
              <DateIcon />
              <span className="EventDetails-date">
                {moment(eventDetails.startTime).format('ll')}
              </span>
            </div>
            <div className="EventDetails-width-45">
              <span className="EventDetails-period">
                {`${moment(eventDetails.startTime).format('LT')} - ${moment(eventDetails.endTime).format('LT')}`}
              </span>
            </div>
          </div>
          <div className="EventDetails-location EventDetails-infoblock">
            <LocationIconEvent />
            <p className="EventDetails-location-address">
              {`${eventDetails.address} | ${eventDetails.location && eventDetails.location.latitude}, ${eventDetails.location && eventDetails.location.longitude}`}
            </p>
          </div>
          <div className="EventDetails-actions EventDetails-infoblock">
            <div
              onClick={showShareModal}
              className="EventDetails-actions-report EventDetails-width-45"
            >
              <ShareIcon />
              <span className="EventDetails-share">Share</span>
            </div>
            {
              /*
              <div className="EventDetails-actions-part EventDetails-width-55">
                <ReportIcon />
                <span className="EventDetails-report">Report event</span>
              </div>
              */
            }
          </div>
          <NavLink to={`/event/${eventDetails.id}/trashpoints`}>
            <div className="EventDetails-trashpoints EventDetails-infoblock">
              <h2 className="EventDetails-header">Trashpoints</h2>
              <p>
                <RubbishIconActive />
                <span>Click to preview trashpoints</span>
                <span className="pointer">{'>'}</span>
                <span className="EventDetails-trashpoints-num">
                  {
                    eventDetails.trashpoints &&
                    eventDetails.trashpoints.length
                  }
                </span>
              </p>
            </div>
          </NavLink>
          <div className="EventDetails-descr EventDetails-infoblock">
            <h2 className="EventDetails-header">Description</h2>
            <p>{eventDetails.description}</p>
          </div>
          <div className="EventDetails-bring EventDetails-infoblock">
            <h2 className="EventDetails-header">What to bring</h2>
            <p>{eventDetails.whatToBring}</p>
          </div>
          <div className="EventDetails-coordinator EventDetails-infoblock">
            <h2 className="EventDetails-header">Coordinator</h2>
            <If condition={!!eventDetails.coordinatorName}>
              <div className="EventDetails-coordinator-part part1">
                <Userpic />
                <p>{eventDetails.coordinatorName}</p>
              </div>
            </If>
            <div className="EventDetails-coordinator-part">
              <PhoneIcon />
              <p>{eventDetails.phonenumber}</p>
            </div>
            <If condition={!!eventDetails.email}>
              <div className="EventDetails-coordinator-part">
                <EmailIcon />
                <p>{eventDetails.email}</p>
              </div>
            </If>
          </div>
          <div className="EventDetails-creator EventDetails-infoblock">
            <h2 className="EventDetails-header">Event creator</h2>
            <div className="EventDetails-creator-part part1">
              <Userpic />
              <p>{eventDetails.createdByName}</p>
            </div>
          </div>
          <div className="EventDetails-attend EventDetails-infoblock">
            <h2 className="EventDetails-header">Attendees</h2>
            <div className="EventDetails-attend-part">
              <ParticipantsIcon />
              <p>
                {eventDetails.attendeesAmount}/{eventDetails.maxPeopleAmount}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Else>
        <Loader />
      </Else>
    </If>
  );
};

Details.propTypes = {
  eventDetails: PropTypes.instanceOf(Object).isRequired,
  showShareModal: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isShareModaVisible: PropTypes.bool.isRequired,
};
