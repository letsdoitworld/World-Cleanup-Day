import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { Divider } from '../../components/Divider';
import { Logout } from '../../components/Logout';
import { actions as userActions, selectors as userSelectors } from '../../reducers/user';
import {
  actions as trashpileActions,
  selectors as trashpileSelectors,
} from '../../reducers/trashpile';
import { withNavigationHelpers } from '../../services/Navigation';
import styles from './styles';

const USERNAME = 'Garbageman666';

class Profile extends Component {
  componentWillMount() {
    this.props.setCachedLocation();
  }

  componentWillReceiveProps({ cachedLocation: { latitude, longitude }, fetchTrashpileAddress }) {
    fetchTrashpileAddress({ latitude, longitude });
  }

  render() {
    const { country } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={styles.pictureContainer}>
            <Image
              source={require('./World-Mission-Society-Church-of-God-Worldwide-Environmental-Cleanup-Movement-for-Passover-2014-06-300x199.png')}
              style={styles.usernameImage}
            />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.username}>
              {USERNAME}
            </Text>
            <View style={styles.locationContainer}>
              <Image source={require('../../assets/images/icon_location.png')} />
              <Text style={styles.countryText}>
                {country}
              </Text>
            </View>
          </View>
        </View>
        <Divider />
        <View style={styles.logoutContainer}>
          <Logout navigation={this.props.navigation} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ trashpile, user }) => {
  return {
    cachedLocation: userSelectors.getCachedLocation(user),
    country: userSelectors.getProfileCountry(user) || trashpileSelectors.getCountry(trashpile),
  };
};

const mapDispatchToProps = {
  fetchTrashpileAddress: trashpileActions.fetchTrashpileAddress,
  setCachedLocation: userActions.setCachedLocation,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withNavigationHelpers())(
  Profile,
);
