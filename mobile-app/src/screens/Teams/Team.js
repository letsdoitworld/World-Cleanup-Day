import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
} from 'react-native';


import { Divider } from '../../components/Divider';
import { COUNTRIES_HASH } from '../../shared/countries';

import styles from './styles';

export default Team = ({ global, team, openTeam }) => (
      <View key={team.id}>
        <TouchableHighlight
          onPress={() => openTeam(team)}
          activeOpacity={0.7}
          underlayColor="transparent"
          key={team.id}>
          <View style={styles.teamContainer}>
            <View style={styles.teamIconContainer}>
              <Image style={styles.teamIconImage}
                     source={{ uri: team.image }}
              />
            </View>
            <View style={styles.teamContentContainer}>
              <View style={styles.teamTitleContainer}>
                <Text style={styles.teamTitle}>
                  {team.name}
                </Text>
              </View>
              <View style={styles.teamNameContainer}>
                <Text style={styles.teamName}>
                  {team.CC ? COUNTRIES_HASH[team.CC] : global}
                </Text>
              </View>
            </View>
            <View style={styles.teamChevronContainer}>
              <Image
                style={styles.teamChevron}
                source={require('../../assets/images/icon_menu_arrowforward.png')}
              />
            </View>
          </View>
        </TouchableHighlight>
        <Divider/>
      </View>
)
