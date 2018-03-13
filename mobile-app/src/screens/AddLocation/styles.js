import dimens from "../../config/dimens";
import {Dimensions} from "react-native";

export default {

    container: {
        flex: 1,
    },
    map: {
        marginTop: 44
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
    confirmButton: {
        position: 'absolute',
        bottom: 0,
        width: Dimensions.get('window').width - dimens.margin_medium * 2,
        marginHorizontal: dimens.margin_medium,
        marginBottom: dimens.margin_medium,
        backgroundColor: 'rgb(0, 143, 223)',
        height: 44,
        justifyContent: 'center',
        borderRadius: 4,
    },
    confirmButtonText: {
        alignSelf: 'center',
        color: 'white',
        fontFamily: 'Lato-Bold',
        fontSize: 17,
        lineHeight: 21,
    },
    searchTextInput: {
        width: '100%',
        height: 29,
        marginHorizontal: dimens.margin_small,
        lineHeight: 21,
        fontSize: 15,
        color: 'rgb(40, 38, 51)',
        alignContent:'center',
    },
    searchTextInputContainer: {
        width: '100%',
        height: 44,
        backgroundColor: 'rgb(228, 241, 253)',
    },
    searchDescription: {
        fontWeight: 'bold',
    },
    searchListView: {
        backgroundColor: 'white',
    },
    searchContainer: {
        position: 'absolute',
        top: 0,
        width: '100%'
    },
}