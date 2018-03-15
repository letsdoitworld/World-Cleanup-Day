import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MarkersMap } from '../../components/MarkersMap';

class AdminMap extends React.Component {
  static propTypes = {
    isUserLoggedIn: PropTypes.bool.isRequired,
    history: PropTypes.shape.isRequired,
  };

  handleMarkerClick = marker => {
    if (marker && !marker.count) {
      this.props.history.location.pathname === '/trashpoints' ?
      this.props.history.push(`/trashpoints/${marker.id}`) :
      this.props.history.push(`/events/${marker.id}`);
    }
  };
  render() {
    const { isUserLoggedIn, history } = this.props;
    return (
      <MarkersMap
        tabOpened={history.location.pathname}
        isUserLoggedIn={isUserLoggedIn}
        onMarkerClick={this.handleMarkerClick}
      />
    );
  }
}

export default withRouter(AdminMap);
