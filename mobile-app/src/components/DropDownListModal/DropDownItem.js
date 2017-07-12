import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, View } from 'react-native';

import styles from './styles';

class DropDownItem extends PureComponent{

  onPress = () => {
    this.props.onPressItem(this.props.code);
  };

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View >
          <Text style={styles.itemText}>
            {this.props.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

DropDownItem.propTypes = {
  name: PropTypes.string,
  code:PropTypes.string,
  onPressItem: PropTypes.func,
};

export default DropDownItem;
