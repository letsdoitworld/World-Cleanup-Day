import React from 'react';
import { connect } from 'react-redux';
import {
  LocationIcon,
  MinimizeIcon,
  BackIcon,
  CollapseIcon,
  ExpandIcon
} from '../../components/common/Icons';
import { selectors } from '../../reducers/events';

const EventListHeader = ({
  onMinimizeClick,
  eventId,
  eventTitle,
  onSearch,
  history,
  listState,
}) => {
  return (
    <div className="EventsList-header">
      {
        !eventId ?
          <LocationIcon /> :
          <button
            className="EventsList-header-back"
            onClick={() => history.push('/event')}
          >
            <BackIcon />
          </button>
      }
      {
        !eventId ?
          <input
            className="EventsList-header-searchbar"
            type="text"
            placeholder="Search location"
            onChange={(ev) => onSearch(50, 1, ev.target.value)}
          /> :
          <span className="EventsList-header-title">
            {eventTitle}
          </span>
      }
      <div
        role="button"
        className="EventsList-header-minimize"
        onClick={onMinimizeClick}
      >
        {
          listState ?
            <CollapseIcon /> :
            <ExpandIcon />
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  eventTitle: selectors.getEventTitle(state),
  listState: selectors.getShowEventWindow(state),
});

export default connect(mapStateToProps)(EventListHeader);
