import { Icons } from '../../assets/images';

export const navigatorStyle = {
  orientation: 'portrait',
  navBarTitleTextCentered: true,
  statusBarColor: 'white',
  statusBarTextColorScheme: 'dark',
  navBarBackgroundColor: 'white',
  navBarTextColor: 'black',
  navBarTextFontSize: 17,
  navBarTextFontFamily: 'Lato-Bold',
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
