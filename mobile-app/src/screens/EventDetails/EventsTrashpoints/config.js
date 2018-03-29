import { Icons } from '../../../assets/images';
import strings from '../../../assets/strings';

export const backId = 'back';

export const navigatorStyle = {
  tabBarHidden: true,
  navBarTitleTextCentered: true,
};

export const navigatorButtons = {
  rightButtons: [
    {
      title: strings.label_add,
      id: 'add_trashpoint',
    },
  ],
  leftButtons: [
    {
      icon: Icons.Back,
      id: backId,
    },
  ],
};
