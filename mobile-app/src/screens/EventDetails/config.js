import { Icons } from '../../assets/images';

export const backId = 'back';
export const trashpoints = 'trashpoints';
export const menuId = 'menu';

export const navigatorStyle = {
  tabBarHidden: true,
  navBarTitleTextCentered: true,
  statusBarColor: 'transparent',
  statusBarTextColorScheme: 'dark',
};

export const navigatorButtons = {
  rightButtons: [
    {
      icon: Icons.Dots,
      id: menuId,
    },
  ],
  leftButtons: [
    {
      icon: Icons.Back,
      id: backId,
    },
  ],
};

export const calendarConfig = {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] dddd',
  sameElse: 'DD/MM/YYYY',
};
