import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Camera from '../../services/Camera';

import IconIO from '@expo/vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';

import { BottomTabs } from '../../components/Tabs';
import { getHeightPercentage } from '../../shared/helpers';
import { Popover } from '../../components/Popover';
import { SimpleButton } from '../../components/Buttons';
import { actions as mapActions } from '../../reducers/map';
import { actions as userActions } from '../../reducers/user';

import styles from './styles';

import { WHITE_COLOR, SIZE_16, SIZE_20, SIZE_18, SIZE_24 } from '../../shared/constants';

const appStyles = EStyleSheet.create({
  container: {
    flex: 1,
  },
});

class Tabs extends Component {
  constructor() {
    super();

    this.state = {
      activeIndex: 0,
    };
  }

  componentDidMount() {
    const { homePopoverDisplays, togglePopover } = this.props;
    if (!homePopoverDisplays) {
      setTimeout(() => togglePopover(), 500);
    }
  }

  dispatchNavigate = (routeName, { params, activeIndex }) => {
    this.tabs.dispatch(NavigationActions.navigate({ routeName, params }));
    this.setState({ activeIndex });
  };

  getTabs = () => {
    const tabs = [
      {
        onPress: () => this.dispatchNavigate('Home', { activeIndex: 0 }),
        inactiveImage: (
          <Image
            source={require('../../assets/images/icon_menu_map.png')}
            width={SIZE_16}
            height={SIZE_20}
            resizeMode="contain"
          />
        ),
        activeImage: (
          <Image
            source={require('../../assets/images/icon_menu_map_active.png')}
            width={SIZE_16}
            height={SIZE_20}
            resizeMode="contain"
          />
        ),
      },
      {
        onPress: () => this.dispatchNavigate('Step2', { activeIndex: 1 }),
        inactiveImage: (
          <Image
            source={require('../../assets/images/icon_menu_activity.png')}
            width={SIZE_18}
            height={SIZE_24}
            resizeMode="contain"
          />
        ),
        activeImage: (
          <Image
            source={require('../../assets/images/icon_menu_activity_active.png')}
            width={SIZE_18}
            height={SIZE_24}
            resizeMode="contain"
          />
        ),
      },
      {
        onPress: () => {
          Camera.takePhotoAsync()
            .then(({ cancelled, uri }) => {
              if (cancelled) {
                return;
              }
              this.props.setCachedLocation();
              this.props.navigation.navigate('CreateMarker', { photos: [uri] });
            })
            .catch(() => {});
        },
        children: (
          <View>
            {this.props.showPopover &&
              <Popover
                ref={popover => (this.popover = popover)}
                show
                onRequestClose={this.handleOnClosePopover}
              >
                <View style={styles.containerPopover}>
                  <View style={styles.textWrapperPopover}>
                    <Text style={styles.titlePopover}>
                      Create a trashpoint
                    </Text>
                    <Text style={styles.descriptionPopover}>
                      Adding a trashpoint is the name of the game. Add more
                      trashpoints to reach a higher level.
                    </Text>
                  </View>
                  <View style={styles.buttonPopover}>
                    <SimpleButton
                      onPress={this.handleClosePopover}
                      text="Ok, got it!"
                    />
                  </View>
                </View>
              </Popover>}
            <View style={styles.containerAddPileButton}>
              <IconIO
                name={'ios-add-circle-outline'}
                size={getHeightPercentage(24)}
                color={WHITE_COLOR}
              />
            </View>
          </View>
        ),
      },
      {
        onPress: () => this.dispatchNavigate('Step3', { activeIndex: 3 }),
        inactiveImage: (
          <Image
            source={require('../../assets/images/icon_menu_updates.png')}
            width={SIZE_16}
            height={SIZE_18}
            resizeMode="contain"
          />
        ),
        activeImage: (
          <Image
            source={require('../../assets/images/icon_menu_updates_active.png')}
            width={SIZE_16}
            height={SIZE_18}
            resizeMode="contain"
          />
        ),
      },
      {
        onPress: () => this.dispatchNavigate('Step4', { activeIndex: 4 }),
        inactiveImage: (
          <Image
            source={require('../../assets/images/icon_menu_profile.png')}
            width={SIZE_18}
            height={SIZE_18}
            resizeMode="contain"
          />
        ),
        activeImage: (
          <Image
            source={require('../../assets/images/icon_menu_profile_active.png')}
            width={SIZE_18}
            height={SIZE_18}
            resizeMode="contain"
          />
        ),
      },
    ];
    return tabs.map((tab, index) => {
      tab.active = index === this.state.activeIndex;
      return tab;
    });
  };

  handleClosePopover = () => {
    this.popover.toggle();
  };

  handleOnClosePopover = () => {
    this.props.togglePopover();
  };

  render() {
    const PropTabs = this.props.tabs;
    return (
      <View style={appStyles.container}>
        <PropTabs style={{ flex: 1 }} ref={tabs => (this.tabs = tabs)} />
        <BottomTabs tabs={this.getTabs()} />
      </View>
    );
  }
}

const mapStateToProps = ({ map: { showPopover, homePopoverDisplays } }) => {
  return {
    showPopover,
    homePopoverDisplays,
  };
};

const mapDispatchToProps = {
  togglePopover: mapActions.togglePopover,
  setCachedLocation: userActions.setCachedLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
