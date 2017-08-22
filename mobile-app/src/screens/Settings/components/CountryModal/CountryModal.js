// TODO if the need arises, port this component to a more general variant

import React, { Component } from 'react';
import { FormInput } from 'react-native-elements';

import {
  TouchableOpacity,
  Modal,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';

import PropTypes from 'prop-types';

import { Header } from '../../../../components/Header';

import styles from './styles';

const Item = ({ key, label, onPress }) => {
  return (
    <TouchableOpacity key={key} onPress={onPress}>
      <View style={styles.item}>
        <Text style={styles.itemText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

class CountryModal extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
  }

  render() {
    const { loading } = this.state;
    const { onClose, countries, onPress, search, onSearchChange, visible } = this.props;

    return (
      <Modal animationType="slide" visible={visible}>
        <View style={{ flex: 1 }}>
          <Header
            onPressLeftButton={onClose}
            title="Select a country"
            titleLeftButton="Cancel"
          />
          <FormInput
            containerStyle={styles.inputContainer}
            placeholder="Search"
            value={search}
            onChangeText={onSearchChange}
          />
          {loading
            ? <View style={styles.loadingContainer}>
              <ActivityIndicator />
            </View>
            : <ScrollView>
              <View style={styles.listContainer}>
                {countries.map((c) => {
                  return Item({
                    key: c.code,
                    label: c.name,
                    onPress: () => onPress(c),
                  });
                })}
              </View>
            </ScrollView>}
        </View>
      </Modal>
    );
  }
}

CountryModal.defaultProps = {
  onPress: () => null,
  onSearchChange: () => null,
  onClose: () => null,
  search: undefined,
};
CountryModal.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
  onPress: PropTypes.func,
  search: PropTypes.string,
  onSearchChange: PropTypes.func,
  onClose: PropTypes.func,
};

export default CountryModal;
