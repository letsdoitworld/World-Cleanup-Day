import { Icons } from '../../../assets/images';

export const backId = 'back';

export const navigatorStyle = {
  tabBarHidden: true,
  navBarTitleTextCentered: true,
};

export const navigatorButtons = {
  rightButtons: [
    {
      icon: Icons.Dots,
      id: 'menu',
    },
  ],
  leftButtons: [
    {
      icon: Icons.Back,
      id: backId,
    },
  ],
};

