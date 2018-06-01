import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { If, Else } from 'react-if';
import {
  LocationIcon,
  BackIcon,
  CollapseIcon,
  ExpandIcon,
} from '../../components/common/Icons';
import { selectors } from '../../reducers/events';

class EventListHeader extends Component {

  static propTypes = {
    onMinimizeClick: PropTypes.func.isRequired,
    eventId: PropTypes.string,
    eventTitle: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    listState: PropTypes.bool,
  };

  static defaultProps = {
    eventId: '',
    eventTitle: '',
    listState: false,
  };

  render() {
    const {
      onMinimizeClick,
      eventId,
      eventTitle,
      onSearch,
      history,
      listState,
    } = this.props;
    const itemsPerPage = 50;
    const pageNumber = 1;

    return (
      <div className="EventsList-header">
        <If condition={!!eventId}>
          <button
            className="EventsList-header-back"
            onClick={() => history.goBack()}
          >
            <BackIcon />
          </button>
          <Else>
            <LocationIcon />
          </Else>
        </If>
        <If condition={!!eventId}>
          <span className="EventsList-header-title">
            {eventTitle}
          </span>
          <Else>
            <input
              className="EventsList-header-searchbar"
              type="text"
              placeholder="Search location"
              onChange={
                (ev) => onSearch(itemsPerPage, pageNumber, ev.target.value)
              }
            />
          </Else>
        </If>
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
  }
}

const mapStateToProps = (state) => ({
  eventTitle: selectors.getEventTitle(state),
  listState: selectors.getShowEventWindow(state),
});

export default connect(mapStateToProps)(EventListHeader);
