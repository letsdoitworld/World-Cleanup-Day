import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  searchTrashPointsAction,
  clearTrashPointsAction,
  loadTrashPointsForMapAction,
} from '../../store/actions/trashPoints';
import { fetchDatasetUIIDAction } from '../../store/actions/app';
import {
  getTrashPointsEntity,
  getMapTrashPointsEntity,
  showTrashPointsNewDeltaEntity,
  datasetUUID,
  isLoading,
  noTrashPoints,
} from '../../store/selectors';

import Component from './AddTrashPoints';

const selector = createStructuredSelector({
  trashPoints: getTrashPointsEntity,
  isLoading,
  mapTrashPoints: getMapTrashPointsEntity,
  delta: showTrashPointsNewDeltaEntity,
  datasetUUIDSelector: datasetUUID,
  isEmpty: noTrashPoints,
});

const actions = {
  onSearchTrashPointsAction: searchTrashPointsAction,
  onClearTrashPointsAction: clearTrashPointsAction,
  onFetchDatasetUUIDAction: fetchDatasetUIIDAction,
  loadTrashPointsForMapAction,
};

export default connect(selector, actions)(Component);
