const ROUTES = {
  ROOT: '/',
  USERLIST: '/users',
  USER_DETAILS: '/users/:id',
  EVENTS_LIST: '/event',
  EVENT_DETAILS: '/event/:eventId',
  EVENT_TRASHPOINTS: '/event/:eventId/trashpoints',
  EVENT_TRASHPOINT_DETAILS: '/event/:eventId/trashpoints/:trashpointId',
  AREALIST: '/user-areas',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  TRASHPOINTS_ROOT: '/trashpoints',
  CREATE_TRASHPOINT: '/trashpoints/create',
  TRASHPOINT_DETAILS: '/trashpoints/:id?',
  TRASHPOINTS: '/trashpoints',
  TRY_OUR_APP: '/try-our-app',
};

export default ROUTES;
