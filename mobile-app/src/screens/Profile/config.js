import { Icons } from '../../assets/images';

export const navigatorStyle = {
  navBarTextColor: '#000000',
  navBarTextFontSize: 18,
  orientation: 'portrait',
  navBarTitleTextCentered: true,
    //  navBarTextFontFamily: 'font-name',
};

export const navigatorButtons = {
  rightButtons: [
    {
      icon: Icons.Settings,
      id: 'settings',
    },
  ],
  leftButtons: [
    {
      icon: Icons.Notification,
      id: 'notification',
    },
  ],
};
