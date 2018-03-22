import dimens from "../../../config/dimens";
import {Dimensions} from "react-native";
import colors from "../../../config/colors";

export default {

    containerProgress: {
        flex: 1,
        justifyContent: 'center'
    },
    containerContent: {
        flex: 1,
        backgroundColor: colors.$mainBackground
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    searchContainerStyle: {
        backgroundColor: "rgb(228, 241, 253)"
    },
    mainContentContainer: {
        position: 'absolute',
        top: 0,
        width:'100%',
        height: '100%'
    },
    vertical: {
        flexDirection: 'column',
    },
    spinner: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    map: {
    },
    navigatorStyle: {
        tabBarHidden: true,
        navBarTitleTextCentered: true,
        navBarBackgroundColor: 'white',
        navBarTextColor: '$textColor',
        navBarTextFontSize: 17,
        navBarTextFontFamily: 'Lato-Bold',
        statusBarColor: 'white',
        statusBarTextColorScheme: 'dark',
    },
    trashPointItem: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    buttonStyle: {
        position: 'absolute',
        right: 0,
        width: '4%',
    }

}