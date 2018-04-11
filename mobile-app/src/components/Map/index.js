import React, {Component} from 'react';
import PropTypes from 'prop-types';

import MapView from 'react-native-maps';

import Marker from './Marker';

import styles, {grayMapStyle} from './styles';
import {Platform} from "react-native";

class Map extends Component {

    displayMarkers = () => {
        const {markers = [], selectedItem, handleOnMarkerPress} = this.props;
        return markers
            .filter(marker => marker !== undefined)
            .map((marker) => {
                return (
                    <Marker
                        marker={marker}
                        key={marker.id}
                        selectedItem={selectedItem}
                        onMarkerPress={handleOnMarkerPress && handleOnMarkerPress.bind(this, marker)}
                    />
                );
            });
    };

    displayCircle = () => {
        const {circleProps} = this.props;
        return circleProps
            ? <MapView.Circle
                center={circleProps.center}
                radius={circleProps.radius}
                strokeWidth={circleProps.borderWidth}
                strokeColor={circleProps.borderColor}
                fillColor={circleProps.fillColor}
            />
            : null;
    };
    onRegionChangeComplete = (region) => {
        const {onRegionChangeComplete} = this.props;
        let {longitudeDelta, longitude} = region;
        if (onRegionChangeComplete) {
            // on android, the longitude delta is sometimes negative ( which doesn't make any sense )
            // https://github.com/airbnb/react-native-maps/issues/1386
            if (longitudeDelta < 0) {
                longitudeDelta += 360;
            }
            // sometimes, on iOS, the longitude can be higher that 180
            // it has to be traslated to an equivalent negative lognitude
            // i.e. 220 degrees means -150 degrees
            if (longitude > 180) {
                longitude -= 360;
            }
            if (longitude < -180) {
                longitude += 360;
            }
            onRegionChangeComplete({
                ...region,
                longitude,
                longitudeDelta,
            });
        }
    };

    render() {
        const outerStyle = this.props.style;
        const containerStyle = {
            flex: 1,
            ...outerStyle,
        };

        return (
            <MapView
                rotateEnabled={false}
                customMapStyle={grayMapStyle}
                {...this.props}
                ref={this.props.getRef}
                style={containerStyle}
                onRegionChangeComplete={this.onRegionChangeComplete}
                provider="google"
            >
                {this.displayMarkers()}
                {this.displayCircle()}
            </MapView>
        );
    }
}

Map.propTypes = {
    // disabled becuase of too many warnings
    // TODO fix this
    // markers: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     latlng: PropTypes.shape(
    //       PropTypes.objectOf({
    //         latitude: PropTypes.number,
    //         longitude: PropTypes.number,
    //       }),
    //     ),
    //     title: PropTypes.string,
    //     description: PropTypes.string,
    //   }),
    // ),
    onRegionChangeComplete: PropTypes.func,
    initialRegion: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        latitudeDelta: PropTypes.number,
        longitudeDelta: PropTypes.number,
    }),
    onMarkerPress: PropTypes.func,
    circleProps: PropTypes.shape({
        radius: PropTypes.number.isRequired,
        borderColor: PropTypes.string.isRequired,
        fillColor: PropTypes.string.isRequired,
        center: PropTypes.shape({
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired,
        }).isRequired,
        borderWidth: PropTypes.number.isRequired,
    }),
    getRef: PropTypes.func,
};

export {Map};
