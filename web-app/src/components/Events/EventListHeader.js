import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { If, Else } from 'react-if';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
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
    updateSearchResultViewport: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
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

  state = {
    searchString: '',
  }

  handleChange = (searchString) => {
    this.setState({ searchString });
  }

  handleSelect = (address) => {
    geocodeByAddress(address)
      .then(results => this.props.updateSearchResultViewport(results[0].geometry.viewport))
      .catch(error => console.error('Error', error));
  }

  render() {
    const {
      onMinimizeClick,
      eventTitle,
      history,
      listState,
      router,
    } = this.props;

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
            <PlacesAutocomplete
              value={this.state.searchString}
              onChange={this.handleChange}
              onSelect={this.handleSelect}
            >
              {
                ({ getInputProps, suggestions, getSuggestionItemProps }) => (
                  <div className="EventsList-header-searchbar-container">
                    <input
                      {
                        ...getInputProps({
                          className: 'EventsList-header-searchbar',
                          type: 'text',
                          placeholder: 'Search location',
                        })
                      }
                    />
                  <div className="EventsList-header-suggestions-block">
                    {
                      suggestions.map(sugg => {
                        return (
                          <div
                            {...getSuggestionItemProps(sugg)}
                            key={sugg.id}
                            className="EventsList-header-suggestion"
                          >
                            <span className="EventsList-header-suggestion-txt">
                              {sugg.description}
                            </span>
                          </div>
                        )
                      })
                    }
                  </div>
                  </div>
                )
              }
            </PlacesAutocomplete>
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
});

export default connect(mapStateToProps)(EventListHeader);
