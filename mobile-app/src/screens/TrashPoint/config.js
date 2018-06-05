import { Icons } from '../../assets/images';

export const cancelId = 'cancel';
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
      id: cancelId,
    },
  ],
};
