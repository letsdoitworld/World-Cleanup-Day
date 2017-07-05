import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import Tab from './Tab';
import styles from './styles';

const BottomTabs = ({ tabs }) => {
  return (
    <View style={styles.container}>
      {tabs.map(
        (
          { activeImage, inactiveImage, active, icon, onPress, children },
          index,
        ) => {
          if (children) {
            return <Tab onPress={onPress} key={index}>{children}</Tab>;
          }
          return icon
            ? <Tab key={index} onPress={onPress} icon={icon} />
            : <Tab
                key={index}
                activeImage={activeImage}
                inactiveImage={inactiveImage}
                active={active}
                onPress={onPress}
              />;
        },
      )}
    </View>
  );
};

BottomTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.any,
      icon: PropTypes.element,
      onPress: PropTypes.func,
    }),
  ),
};

export default BottomTabs;

