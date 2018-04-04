import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import {
    fetchUserLocation,
} from '../../store/actions/locations';

import {
    getUserCountry,
    isLoading,
    getMapTrashPointsEntity,
    showTrashPointsNewDeltaEntity,
    getCoordUser,
    getTrashPointsEntity,
    datasetUUID
} from '../../store/selectors';

import Component from './TrashPoints';
import {fetchDatasetUIIDAction} from "../../store/actions/app";
import {
    loadTrashPointsForMapAction,
    loadTrashPointsFromClusterAction
} from "../../store/actions/trashPoints";

const selector = createStructuredSelector({
    trashPoints: getTrashPointsEntity,
    country: getUserCountry,
    isLoading,
    userCoord: getCoordUser,
    mapTrashPoints: getMapTrashPointsEntity,
    delta: showTrashPointsNewDeltaEntity,
    datasetUUIDSelector: datasetUUID,
});

const actions = {
    onFetchLocation: fetchUserLocation,
    onFetchDatasetUUIDAction: fetchDatasetUIIDAction,
    loadTrashPointsForMapAction: loadTrashPointsForMapAction,
    loadTrashPointsFromClusterAction: loadTrashPointsFromClusterAction
};

export default connect(selector, actions)(Component);
