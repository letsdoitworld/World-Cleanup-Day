import React from 'react';
import { Image, View, Text } from 'react-native';
import strings  from '../../assets/strings';
import moment from 'moment';

import styles from './styles';
const DATE_FORMAT = 'DD.MM.YYYY';

const TrashpointDate = ({
  createdDate,
  updatedDate,
  createdBy,
  updatedBy,
  t
}) => {
    let createdDateStr = createdDate ? moment(createdDate).format(DATE_FORMAT) : '';
    let updatedDateStr = updatedDate ? moment(updatedDate).format(DATE_FORMAT) : '';
    if(createdBy){
      createdDateStr = `${createdDateStr} ${t('label_TP_by')} ${createdBy}`;
    }

    if(updatedBy){
      updatedDateStr = `${updatedDateStr} ${t('label_TP_by')} ${updatedBy}`;
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
          {t('label_TP_created_date')}
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
          {t('label_TP_updated_date')}
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

export default translate()(TrashpointDate);
