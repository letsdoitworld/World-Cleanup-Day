const ROUTES = {
  ROOT: '/',
  USERLIST: '/countries/users',
  USER_DETAILS: '/users/:id',
  COUNTRIES_LIST: '/countries',
  EVENTS_LIST: '/event',
  EVENT_DETAILS: '/event/:eventId',
  EVENT_TRASHPOINTS: '/event/:eventId/trashpoints',
  EVENT_TRASHPOINT_DETAILS: '/event/:eventId/trashpoints/:trashpointId',
  AREALIST: '/user-areas',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  TRASHPOINTS_ROOT: '/trashpoints',
  CREATE_TRASHPOINT: '/trashpoints/create',
  TRASHPOINT_DETAILS: '/trashpoints/:id?/:edit?',
  TRASHPOINTS: '/trashpoints',
  TRY_OUR_APP: '/try-our-app',
  TEAMS_LIST: '/teams',
  TEAM_DETAILS: '/teams/:id/:trashpoints?/:tpId?',
};

export default ROUTES;
