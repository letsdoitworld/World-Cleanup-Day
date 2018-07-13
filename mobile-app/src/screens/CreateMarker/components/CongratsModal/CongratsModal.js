import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Text, Image, TouchableOpacity } from 'react-native';

import styles from './styles';
import strings from '../../../../assets/strings';

const noop = () => null;
const CongratsModal = (props) => {
  return (
    <Modal animationType="fade" visible onRequestClose={noop}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={require('./images/image.png')}
        />
        <Text style={styles.imageText}>{strings.label_text_congrats_image}</Text>
        <Text style={styles.header}>{strings.label_text_congrats_subtitle}</Text>
        <Text style={styles.subHeader}>
          {strings.label_text_congrats_text}
        </Text>
        <TouchableOpacity
          onPress={props.onContinuePress}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmButtonText}>
            {strings.label_button_continue}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

CongratsModal.propTypes = {
  onContinuePress: PropTypes.func,
};

export default CongratsModal;
// const CongratsModal = ({ onContinuePress,  }) => {
//   return (
//     <Modal animationType="fade" visible onRequestClose={noop}>
//       <View style={styles.container}>
//         <Image
//           style={styles.image}
//           resizeMode="contain"
//           source={require('./images/image.png')}
//         />
//         <Text style={styles.imageText}>{strings.label_text_congrats_image}</Text>
//         <Text style={styles.header}>{strings.label_text_congrats_subtitle}</Text>
//         <Text style={styles.subHeader}>
//           {strings.label_text_congrats_text}
//         </Text>
//         <Button
//           onPress={onContinuePress}
//           style={styles.button}
//           text={strings.label_button_continue}
//         />
//       </View>
//     </Modal>
//   );
// };
// CongratsModal.propTypes = {
//   onContinuePress: PropTypes.func.isRequired,
// };
//
// export default translate()(CongratsModal);
