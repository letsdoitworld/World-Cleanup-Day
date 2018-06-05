import { createSelector } from 'reselect';

const adminSelector = state => state.admin;

const usersSelector = createSelector(adminSelector, state => state.users);
const getUsers = createSelector(usersSelector, state => state.users);
const getUsersLoading = createSelector(usersSelector, state => state.loading);
const getUsersError = createSelector(usersSelector, state => state.error);
const getUsersLastPage = createSelector(
  usersSelector,
  state => state.lastLoadedPage,
);
const getUsersPageSize = createSelector(usersSelector, state => state.pageSize);
const canLoadMoreUsers = createSelector(
  usersSelector,
  state => state.canLoadMore,
);
const getTotalUsers = createSelector(usersSelector, state => state.total);

const userSelector = createSelector(adminSelector, state => state.user);
const getUser = createSelector(userSelector, state => state.user);
const getUserLoading = createSelector(userSelector, state => state.loading);
const getUserError = createSelector(userSelector, state => state.error);

export default {
  adminSelector,
  getUsers,
  getUsersLoading,
  getUsersError,
  getUsersLastPage,
  canLoadMoreUsers,
  getUsersPageSize,
  getTotalUsers,

  getUser,
  getUserLoading,
  getUserError,
};
