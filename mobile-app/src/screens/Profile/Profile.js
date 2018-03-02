import React, { Component } from 'react';
import { View, Image, Text, Alert } from 'react-native';
// import { compose } from 'recompose';
import { connect } from 'react-redux';

import { Divider } from '../../components/Divider/Divider';
import { selectors as userSelectors } from '../../reducers/user';
import styles from './styles';
import {SETTINGS_SCREEN} from "../index";
import strings from '../../config/strings';
import userActions from '../../reducers/user/actions';

class Profile extends Component {

    static navigatorStyle = {
        navBarTextColor: '#000000',
        navBarTextFontSize: 18,
        orientation: 'portrait',
        navBarTitleTextCentered: true,
        //  navBarTextFontFamily: 'font-name',
    };

    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../screens/Profile/images/settings.png'),
                id: 'settings'
            }
        ]

    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    
    componentDidMount() {
        this.props.dispatch(userActions.fetchProfile())
    }

  renderProfilePicture = (profile) => {
    const img = profile && profile.pictureURL ? { uri: profile.pictureURL } : require('./avatar.png');
    return <Image source={img} style={styles.usernameImage} />;
  };

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type == 'NavBarButtonPress') {
            if (event.id == 'settings') {
                this.props.navigator.push({
                    screen: SETTINGS_SCREEN,
                    title: strings.label_settings_header
                })
            }
        }
    }

  render() {
    const { profile, country } = this.props;
    
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={styles.pictureContainer}>
            {this.renderProfilePicture(profile)}
          </View>
          {/*<View style={styles.nameContainer}>*/}
            {/*<Text style={styles.username}>*/}
              {/*{profile && profile.name}*/}
            {/*</Text>*/}
            {/*{country &&*/}
              {/*<View style={styles.locationContainer}>*/}

                {/*<Image*/}
                  {/*source={require('../../assets/images/icon_location.png')}*/}
                {/*/>*/}
                {/*<Text style={styles.countryText}>*/}
                  {/*{country.name}*/}
                {/*</Text>*/}
              {/*</View>}*/}

          {/*</View>*/}
        </View>
        <Divider />
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    // profile: userSelectors.getProfile(state)
    profile: state.get('profile')
  };
};

export default connect(mapStateToProps)(Profile)
