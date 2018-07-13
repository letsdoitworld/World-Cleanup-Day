import React, { PureComponent } from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import styles from './styles';
import Checkbox from '../../../components/Checkbox/Checkbox';
import strings from '../../../assets/strings';
import { TRASH_POINT } from '../../index';
import {
  CleanedTrashpoint,
  RegularTrashpoint,
  RegularTrashpointInactive,
  ToxicTrashpoint,
} from '../../../assets/images';

export const STATUS_IMAGES = {
  cleaned: CleanedTrashpoint,
  outdated: RegularTrashpointInactive,
  regular: RegularTrashpoint,
  threat: ToxicTrashpoint,
};

export function renderItem(item, checked, style, onPress,
  onCheckedChanged, isNotCheckable = false, mapView) {
  return (
    <TouchableHighlight
      disabled={onPress === undefined}
      underlayColor="rgb(232, 232, 232)"
      onPress={onPress}
      style={[item.isIncluded ? styles.itemTouchIncluded : styles.itemTouch, style]}
    >
      <View style={styles.itemContent}>
        <Image
          style={styles.status}
          source={STATUS_IMAGES[item.status]}
        />
        <Image
          style={styles.pin}
          resizeMode={'contain'}
          source={require('./images/icSmallLocationPinInactive.png')}
        />
        <View style={styles.titleContainer}>
          <Text
            numberOfLines={1}
            style={mapView
              ? [styles.titleBlack, { paddingRight: 30 }]
              : styles.titleBlack}
          >
            {item.name}
          </Text>
          {
            item.isIncluded ?
              (
                <Text
                  numberOfLines={1}
                  style={styles.includedText}
                >
                  {strings.label_included_into_another_event}
                </Text>
              )
              : null
          }
        </View>
        {
          !item.isIncluded && !isNotCheckable ?
            (
              <Checkbox
                checked={checked}
                onCheckedChanged={checkedItem => onCheckedChanged(checkedItem, item)}
                style={styles.checkbox}
              />
            )
            : null
        }
      </View>
    </TouchableHighlight>
  );
}

export default class ListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked,
      isTrashPointPop: props.cancelTrashPointFromEvent,
    };
  }

  onPress() {
    this.props.navigator.push({
      screen: TRASH_POINT,
      title: strings.label_trashpoint,
      passProps: {
        onCheckedChanged: this.onCheckedChanged,
        trashPoint: this.props.item,
        isChecked: this.state.checked,
        updateDisabled: true,
        cancelTrashPointFromEvent: this.state.isTrashPointPop,
      },
    });
  }

  onCheckedChanged = (checked) => {
    this.setState({ checked });
    this.props.onCheckedChanged(checked, this.props.item);
  };

  render() {
    const item = this.props.item;
    const checked = this.state.checked;

    return renderItem(item, checked,
      this.props.style, this.onPress.bind(this), this.onCheckedChanged);
  }
}
