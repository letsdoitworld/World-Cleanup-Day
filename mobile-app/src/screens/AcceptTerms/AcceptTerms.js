import React from 'react';
import { connect } from 'react-redux';
import { View, StatusBar, BackHandler } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import strings  from '../../assets/strings';

import { operations as userOps } from '../../reducers/user';
import { Button } from '../../components/Button';
import { Terms } from '../../components/Terms';
import styles from './styles';

class AcceptTerms extends React.Component {
  constructor(props) {
    super(props);

    this.handleBackPress = this.handleBackPress.bind(this);
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  onPress = () => {
    const { navigation, agreeToTerms } = this.props;
    agreeToTerms().then(() => {
      navigation.resetTo('Tabs', {});
    });
  };

  handleBackPress = () => {
    this.props.navigation.navigate('DenyTerms');
    return true;
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent barStyle="dark-content" />
        <Terms style={styles.terms} />
        <Button
          style={styles.button}
          text={this.props.t('label_button_tc_agree')}
          onPress={this.onPress}
        />
      </View>
    );
  }
}
AcceptTerms.propTypes = {
  navigation: PropTypes.object.isRequired,
  agreeToTerms: PropTypes.func.isRequired,
};

const mapDispatch = {
  agreeToTerms: userOps.agreeToTerms,
};

export default compose(
  connect(undefined, mapDispatch),
  withNavigationHelpers(),
  translate(),
)(AcceptTerms);
