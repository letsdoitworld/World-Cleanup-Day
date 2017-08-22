import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, Modal } from 'react-native';

import DropDownItem from './DropDownItem';
import { Button } from '../Buttons';
import { Divider } from '../Divider';
import styles from './styles';
import { translate } from 'react-i18next';

class DropDownListModal extends Component {
  static propTypes = {
    items: PropTypes.array,
    onPressItem: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      show: this.props.show,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.show !== nextProps.show) {
      this.setState({ show: nextProps.show });
    }
  }

  handleCancel = () => {
    this.setState({show:false})
  };

  _renderItem = ({ item }) =>
    <DropDownItem {...item} onPressItem={this.props.onPressItem} />;

  _keyExtractor = ({ code }) => code;

  render() {
    return (
      <Modal visible={this.state.show} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={styles.listWrapper}>
              <View>
                <FlatList
                  data={this.props.items}
                  renderItem={this._renderItem}
                  keyExtractor={this._keyExtractor}
                  ItemSeparatorComponent={Divider}
                />
              </View>
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                text={this.props.t('label_button_cancel')}
                customStyles={{ touchableContainer: { borderRadius: 10 } }}
                onPress={this.handleCancel}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default translate()(DropDownListModal);
