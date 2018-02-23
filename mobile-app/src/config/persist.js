// import { persistStore } from 'redux-persist';
// import { createFilter } from 'redux-persist-transform-filter';
//
// const appFilter = createFilter('app', ['popover']);
// const userFilter = createFilter('user', ['auth']);
//
// export const persistStoreAsync = ({ store, storage }) => {
//   return new Promise((resolve, reject) => {
//     persistStore(
//       store,
//       {
//         storage,
//         debounce: 100,
//         whitelist: ['app', 'user'],
//         transforms: [appFilter, userFilter],
//       },
//       (persistor) => {
//         resolve(persistor);
//       },
//     );
//   });
// };
