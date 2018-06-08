import { createSelector } from 'reselect';
import { selectors as trashpileSelector } from '../trashpile';
import { selectors as teamsSelector } from '../teams';

import { COUNTRY_LIST, USER_ROLES } from '../../shared/constants';

const stateSelector = state => state.user;
const profileSelector = createSelector(stateSelector, state => state.profile);
const authSelector = createSelector(stateSelector, state => state.auth);

const isAuthenticated = createSelector(authSelector, auth => !!auth.token);
const getToken = createSelector(authSelector, auth => auth.token);

const getProfile = createSelector(profileSelector, profile => profile.entity);

const isProfileLoading = createSelector(
  profileSelector,
  profile => profile.loading,
);
const getProfileError = createSelector(
  profileSelector,
  profile => profile.error,
);

const isProfileUpdating = createSelector(
  profileSelector,
  profile => profile.updating,
);

const didAgreeToTerms = createSelector(
  authSelector,
  state => state.termsAgreed,
);
const getUserProfileId = createSelector(
  getProfile,
  profile => (profile ? profile.id : undefined),
);
const isOwnTrashpoint = createSelector(
  getUserProfileId,
  trashpileSelector.getMarkerCreatorId,
  (userProfileId, markerCreatorId) => userProfileId === markerCreatorId,
);

const getProfileCountry = createSelector(getProfile, (profile) => {
  if (!profile || !profile.country) {
    return undefined;
  }
  return COUNTRY_LIST.find(c => c.code === profile.country);
});
const getProfileTeam = createSelector(
  getProfile,
  profile => profile && profile.teamInfo,
);

const getProfileTeamId = createSelector(
  getProfileTeam,
  team => team && team.id,
);

const getRole = createSelector(getProfile, (profile) => {
  if (!profile) {
    return undefined;
  }
  return profile.role;
});
const isLeader = createSelector(getRole, role => role === USER_ROLES.LEADER);
const isSuperAdmin = createSelector(
  getRole,
  role => role === USER_ROLES.SUPERADMIN,
);

const getCachedLocation = () => undefined;
export default {
  isAuthenticated,
  getProfile,
  isProfileLoading,
  getProfileError,
  getProfileCountry,
  getProfileTeam,
  getCachedLocation,
  didAgreeToTerms,
  getToken,
  getUserProfileId,
  isOwnTrashpoint,
  isProfileUpdating,
  getRole,
  isLeader,
  isSuperAdmin,
  getProfileTeamId,
};
