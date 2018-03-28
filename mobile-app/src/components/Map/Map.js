
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Marker from './Marker';
import styles from './styles';

import MapView from 'react-native-maps';

const mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f5f5"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e5e5e5"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c9c9c9"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    }
];

export class Map extends Component {

    displayMarkers = () => {
        const {markers = [], handleOnMarkerPress} = this.props;
        console.log("displayMarkers", markers);
        return markers
            .filter((marker) => marker !== undefined)
            .map((marker) => {
                return (
                    <Marker
                        marker={marker}
                        key={marker.id}
                        onMarkerPress={(obj) => {
                            handleOnMarkerPress(marker)
                        }}/>
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
            ...outerStyle
        };

        return (
            <MapView
                customMapStyle={mapStyle}
                rotateEnabled={false}
                {...this.props}
                ref={this.props.getRef}
                style={containerStyle}
                onRegionChangeComplete={this.onRegionChangeComplete}
                provider="google">
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

//export default Map;