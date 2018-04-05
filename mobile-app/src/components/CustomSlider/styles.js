import {Dimensions} from "react-native";

const {height, width} = Dimensions.get('window');

export default {
    blueDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#4AA5FF',
        position: 'absolute',
        top: 15,
        zIndex: 10
    },
    mainContainer: {
        backgroundColor: '#eeeeee',
        height: 110,
        flexDirection: 'column',
        width: width,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
}