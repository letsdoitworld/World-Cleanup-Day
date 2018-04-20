import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {Map} from '../../../../components/Map';
import {DEFAULT_ZOOM, SCREEN_WIDTH} from '../../../../shared/constants';

import styles from './styles';
import strings from '../../../../assets/strings'


export default class LocationPicker extends React.Component {
    render() {
        const {value: {latitude, longitude}} = this.props;
        const {address} = this.props;
        const {onEditLocationPress, status} = this.props;

        const latitudeDelta = DEFAULT_ZOOM;
        const longitudeDelta = latitudeDelta * SCREEN_WIDTH / styles.$mapContainerHeight;
        const marker = {
            id: 0,
            latlng: {latitude, longitude},
            status,
        };
        return (
            <View style={styles.container}>
                <Map
                    style={{
                        height: 198,
                        flex: 1
                    }}
                    markers={[marker]}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    region={{
                        latitudeDelta,
                        longitudeDelta,
                        latitude,
                        longitude,
                    }}
                    liteMode
                />
                <View style={styles.row}>
                    <Image
                        source={require('../../../../assets/images/icTrashpointAddress.png')}/>
                    <Text numberOfLines={2} style={styles.address}>
                        {address}
                    </Text>
                    <TouchableOpacity onPress={onEditLocationPress} style={styles.editLocationContainer}>
                        <Text style={styles.editLocation}>{strings.label_edit}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
