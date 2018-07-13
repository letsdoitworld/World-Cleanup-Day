import Permissions from 'react-native-permissions';
import DeviceSettings from 'react-native-device-settings';
import { Alert, AlertButton } from 'react-native';

type Permission = 'camera' | 'photo' | 'location';

function showAlert(title:string, message?:string, buttons?:AlertButton[]):void {
  if (buttons) {
    Alert.alert(title, message, buttons, { cancelable: false });
  } else {
    Alert.alert(title, message, null, { cancelable: false });
  }
}

function showSettingsDialog(permission:Permission):void {
  showAlert(
    'Permission required.',
    `Please grant ${permission} permission to use this feature.`,
    [
      {
        text: 'Cancel',
      },
      {
        text: 'Go to Settings',
        onPress: () => DeviceSettings.app(),
      },
    ],
  );
}

export async function requestPermission(permission:Permission):Promise<boolean> {
  try {
    const granted = await Permissions.request(permission);
    if (granted === 'authorized') {
      return Promise.resolve(true);
    }
    showSettingsDialog(permission);

    return Promise.resolve(false);
  } catch (err) {
    showSettingsDialog(permission);

    return Promise.resolve(false);
  }
}
