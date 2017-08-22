import React from 'react';
import { Image, View, Text } from 'react-native';
import moment from 'moment';

import styles from './styles';
const DATE_FORMAT = 'DD.MM.YYYY';

const TrashpointDate = ({
  createdDate,
  updatedDate,
  createdBy,
  updatedBy,
}) => {
    let createdDateStr = createdDate ? moment(createdDate).format(DATE_FORMAT) : '';
    let updatedDateStr = updatedDate ? moment(updatedDate).format(DATE_FORMAT) : '';
    if(createdBy){
      createdDateStr = `${createdDateStr} by ${createdBy}`;
    }

    if(updatedBy){
      updatedDateStr = `${updatedDateStr} by ${updatedBy}`;
    }
  return (
    <View>
      <View style={styles.imageContainer}>
        <Image
          source={require('./images/icon_creation.png')}
          style={styles.creationImage}
          resizeMode="contain"
        />
        <Text style={styles.createdText}>
          Created
        </Text>
        <View>
          <Text style={styles.dateText}>
            {createdDateStr}
          </Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require('./images/icon_updated.png')}
          style={styles.updateImage}
          resizeMode="contain"
        />
        <Text style={styles.updatedText}>
          Updated
        </Text>
        <View>
          <Text style={styles.dateText}>
            {updatedDateStr}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TrashpointDate;
