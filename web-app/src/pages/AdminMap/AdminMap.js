import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MarkersMap } from '../../components/MarkersMap';
import { selectors as appSelectors } from '../../reducers/app';

class AdminMap extends React.Component {
  static propTypes = {
    isUserLoggedIn: PropTypes.bool.isRequired,
    currentActiveTab: PropTypes.string.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleMarkerClick = marker => {
    if (marker && !marker.count) {
      switch (this.props.currentActiveTab) {
        case ('events'):
          this.props.history.push(`/event/${marker.id}`);
          break;
        case ('trashpoints'):
          this.props.history.push(`/trashpoints/${marker.id}`);
          break;
        default:
          this.props.history.push(`/event/${marker.id}`);
      }
    }
  };
  render() {
    const { isUserLoggedIn } = this.props;
    return (
      <MarkersMap
        tabActive={this.props.currentActiveTab}
        isUserLoggedIn={isUserLoggedIn}
        onMarkerClick={this.handleMarkerClick}
      />
    );
  }
}

const mapStateToProps = state => ({
  currentActiveTab: appSelectors.getCurrentActiveTab(state),
});

export default withRouter(connect(mapStateToProps)(AdminMap));
