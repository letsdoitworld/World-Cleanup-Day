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
import {
  selectors as appSelectors,
} from '../../reducers/app';

class EventListHeader extends Component {

  static propTypes = {
    onMinimizeClick: PropTypes.func.isRequired,
    eventTitle: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    rectangle: PropTypes.shape({
      nw: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
      }),
      se: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
      }),
    }).isRequired,
    listState: PropTypes.bool,
    router: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
      hash: PropTypes.string,
      key: PropTypes.string,
      action: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    eventId: '',
    eventTitle: '',
    listState: false,
  };

  render() {
    const {
      onMinimizeClick,
      eventTitle,
      onSearch,
      history,
      listState,
      router,
      rectangle,
    } = this.props;
    const itemsPerPage = 20;
    const pageNumber = 1;
    const ifListDisplayed =
    !!router.pathname.split('/')[2] || !!window.location.pathname.split('/')[2];
    /*
      define if pathname contains event ID and then decide if render
      search bar or event title (in last case we take it from store)
    */
    return (
      <div className="EventsList-header">
        <If condition={ifListDisplayed}>
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
        <If condition={ifListDisplayed}>
          <span className="EventsList-header-title">
            {eventTitle}
          </span>
          <Else>
            <input
              className="EventsList-header-searchbar"
              type="text"
              placeholder="Search location"
              onChange={
                (ev) => onSearch(rectangle, itemsPerPage, pageNumber, ev.target.value)
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
  router: appSelectors.getRouterInfo(state),
  rectangle: appSelectors.getViewport(state),
});

export default connect(mapStateToProps)(EventListHeader);
