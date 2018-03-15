import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MarkersMap } from '../../components/MarkersMap';

class AdminMap extends React.Component {
  static propTypes = {
    isUserLoggedIn: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
  };

  handleMarkerClick = marker => {
    if (marker && !marker.count) {
      this.props.history.push(`/events/${marker.id}`);
    }
  };
  render() {
    const { isUserLoggedIn } = this.props;
    return (
      <MarkersMap
        isUserLoggedIn={isUserLoggedIn}
        onMarkerClick={this.handleMarkerClick}
      />
    );
  }
}

export default withRouter(AdminMap);
