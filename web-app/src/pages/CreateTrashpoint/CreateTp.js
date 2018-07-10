import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  actions as trashpileOperations,
  selectors,
} from '../../reducers/trashpile';
import {
  selectors as userSels,
} from '../../reducers/user';
import { CreateTrashpoint } from '../../components/CreateTrashpoint';
import { Loader } from '../../components/Spinner';

class CreateTp extends Component {

  static propTypes = {
    trashTypes: PropTypes.arrayOf(PropTypes.shape).isRequired,
    trashOrigin: PropTypes.arrayOf(PropTypes.shape).isRequired,
    userProfile: PropTypes.any.isRequired,
    createTrashpoint: PropTypes.func.isRequired,
    fetchTrashTypesAndOrigin: PropTypes.func.isRequired,
    history: PropTypes.any.isRequired,
  }

  componentWillMount() {
    this.props.fetchTrashTypesAndOrigin();
  }

  render() {
    const {
      trashTypes,
      trashOrigin,
      userProfile,
      createTrashpoint,
      history,
    } = this.props;
    return (
      trashOrigin.length ?
        <CreateTrashpoint
          trashTypes={trashTypes}
          trashOrigin={trashOrigin}
          userProfile={userProfile}
          createTrashpoint={createTrashpoint}
          history={history}
        /> :
        <div className="CreateTrashpoint">
          <div className="CreateTrashpoint-header">
            <span className="CreateTrashpoint-title">
              Loading...
            </span>
          </div>
          <div className="CreateTrashpoint-plot">
            <Loader />
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  trashTypes: selectors.getTrashTypes(state),
  trashOrigin: selectors.getTrashOrigin(state),
  userProfile: userSels.getProfile(state),
});

const mapDispatchToProps = dispatch => ({
  createTrashpoint(marker) {
    return dispatch(trashpileOperations.createMarker(marker, false));
  },
  fetchTrashTypesAndOrigin() {
    return dispatch(trashpileOperations.fetchTrashTypesAndOrigin());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateTp);
