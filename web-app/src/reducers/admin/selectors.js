import { createSelector } from 'reselect';

const adminSelector = state => state.admin;

const usersSelector = createSelector(adminSelector, state => state.users);
const getUsers = createSelector(usersSelector, state => state.users);
const getUsersLoading = createSelector(usersSelector, state => state.loading);

const userSelector = createSelector(adminSelector, state => state.user);
const getUser = createSelector(userSelector, state => state.user);
const getUserLoading = createSelector(userSelector, state => state.loading);
const getUserError = createSelector(userSelector, state => state.error);

export default {
  adminSelector,
  getUsers,
  getUsersLoading,

  getUser,
  getUserLoading,
  getUserError,
};
