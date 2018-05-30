import { NavLink } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { If, Else } from 'react-if';
import EventListHeader from './EventListHeader';
import { EventDetails } from './EventDetails';
import { TrashpointList } from './EventTrashpointList/TrashpointList';
import { Event } from './Event';
import { noEventsCover } from '../common/Icons';
import './EventsList.css';

class EventsList extends Component {

  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape).isRequired,
    toggleEventWindow: PropTypes.func.isRequired,
    eventId: PropTypes.string,
    isTrashpointList: PropTypes.bool,
    trashpointId: PropTypes.string,
    eventDetails: PropTypes.any,
    isOpened: PropTypes.bool.isRequired,
    fetchEventDetails: PropTypes.func.isRequired,
    fetchEventsList: PropTypes.func.isRequired,
    showShareModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    eventId: '',
    isTrashpointList: false,
    trashpointId: '',
    eventDetails: null,
  };

  render() {
    const {
      events,
      toggleEventWindow,
      eventId,
      isTrashpointList,
      trashpointId,
      eventDetails,
      history,
      isOpened,
      fetchEventDetails,
      fetchEventsList,
      showShareModal,
    } = this.props;
    const { id } = eventDetails;
    return (
      <div className="EventsList-container">
        <EventListHeader
          onMinimizeClick={toggleEventWindow}
          onSearch={fetchEventsList}
          history={history}
          eventId={eventId}
          trashpointId={trashpointId}
        />
        <div className={classnames('EventsList-plot', { visible: isOpened })}>
          <If condition={isTrashpointList && !!eventDetails.trashpoints && !!eventDetails.trashpoints.length}>
            <TrashpointList trashpoints={eventDetails.trashpoints} />
          </If>
          <If condition={id && eventId && !isTrashpointList}>
            <EventDetails
              eventId={eventId}
              eventDetails={eventDetails}
              showShareModal={showShareModal}
            />
            <Else>
              <If condition={!!events.length && !isTrashpointList}>
                <div>
                  {
                    events.map(ev => {
                      return (
                        <NavLink key={ev.id} to={`/event/${ev.id}`}>
                          <Event
                            eventId={ev.id}
                            avatar={ev.photos[0]}
                            title={ev.name}
                            author={ev.createdByName}
                            date={ev.startTime}
                            location={ev.address}
                            maxNumberOfParticipants={ev.maxPeopleAmount || 20}
                            numberOfParticipants={ev.peopleAmount}
                          />
                        </NavLink>
                      );
                    },
                    )
                  }
                </div>
              </If>
            </Else>
          </If>
        </div>
      </div>
    );
  }
}

export default EventsList;

/*
<div className="no-events-holder">
  <img src={noEventsCover} alt="no-events-cover" />
  <div className="no-events-text">
    <p className="p1">Nothing to see here!</p>
    <p className="p2">
      Widen the search area or try another filter
    </p>
  </div>
</div>
*/
