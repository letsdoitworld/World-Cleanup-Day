import React from 'react';
import { TabMiddleButton } from '../../components/TabMiddleButton';

class CreateMarkerButton extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarIcon: <TabMiddleButton navigation={navigation} />,
    };
  };
  render() {
    return null;
  }
}
export default CreateMarkerButton;
