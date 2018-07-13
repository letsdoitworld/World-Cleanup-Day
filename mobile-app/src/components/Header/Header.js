/* eslint-disable no-undef */
import React from 'react';
import { View, Text } from 'react-native';
import _ from 'lodash';

import styles from './styles';
import { SimpleButton, ImageButton } from '../Button';

export const HEADER_BUTTONS_IMAGES = {
  arrowBack: {
    source: require('./images/icon_menu_arrowback.png'),
    styles: { width: 6, height: 10 },
  },
  settings: {
    source: require('./images/settings.png'),
    styles: { width: 18, height: 18, alignSelf: 'flex-end' },
  },
};

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.onPressLeftButton = _.debounce(this.onPressLeftButton, 1000, {
      leading: true,
      trailing: false,
    });
    this.onPressRightButton = _.debounce(this.onPressRightButton, 1000, {
      leading: true,
      trailing: false,
    });
  }

  onPressLeftButton = () => {
    this.props.onPressLeftButton && this.props.onPressLeftButton();
  };

  onPressRightButton = () => {
    this.props.onPressRightButton && this.props.onPressRightButton();
  };

  render() {
    const {
      title = this.props.t('label_button_cancel'),
      titleLeftButton = '',
      titleRightButton = '',
      leftButtonImage,
      rightButtonImage,
    } = this.props;

    const showLeftButton = !!titleLeftButton;
    const showRightButton = !!titleRightButton;

    return (
      <View style={styles.container}>
        <View style={styles.leftButtonContainer}>
          {showLeftButton &&
            <SimpleButton
              text={titleLeftButton}
              onPress={this.onPressLeftButton}
              textStyles={styles.buttonTextStyle}
            />}
          {leftButtonImage &&
            <ImageButton
              source={leftButtonImage.source || HEADER_BUTTONS_IMAGES.arrowBack.source}
              onPress={this.onPressLeftButton}
              imageStyles={leftButtonImage.styles
              || HEADER_BUTTONS_IMAGES.arrowBack.styles}
            />}
        </View>
        <Text style={styles.titleText}>
          {title}
        </Text>
        <View style={styles.rightButtonContainer}>
          {showRightButton &&
            <SimpleButton
              text={titleRightButton}
              onPress={this.onPressRightButton}
              textStyles={styles.buttonTextStyle}
            />}
          {rightButtonImage &&
            <ImageButton
              source={rightButtonImage.source || HEADER_BUTTONS_IMAGES.settings.source}
              onPress={this.onPressRightButton}
              imageStyles={rightButtonImage.styles
              || HEADER_BUTTONS_IMAGES.settings.styles}
            />}
        </View>
      </View>
    );
  }
}

export default translate()(Header);
