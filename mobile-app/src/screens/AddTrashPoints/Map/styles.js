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
    // navigatorStyle: {
    //     tabBarHidden: true,
    //     navBarTitleTextCentered: true,
    //     navBarBackgroundColor: 'white',
    //     navBarTextColor: '$textColor',
    //     navBarTextFontSize: 17,
    //     navBarTextFontFamily: 'Lato-Bold',
    //     statusBarColor: 'white',
    //     statusBarTextColorScheme: 'dark',
    // },
    // searchField: {
    //     backgroundColor: 'white',
    //     flex: 1,
    //     height: 29,
    //     paddingVertical: 0,
    //     paddingHorizontal: dimens.margin_small,
    //     margin: dimens.margin_small,
    //     borderRadius: 5,
    //     fontFamily: "Lato-Regular",
    //     color: 'rgb(40, 38, 51)',
    //     fontSize: 15,
    //     lineHeight: 21,
    // },
    // listDivider: {
    //     height: 1,
    //     backgroundColor: 'rgb(229, 229, 233)',
    // },
    // paginationFooter: {
    //     height: 86,
    // },
    // list: {
    //     flex: 1,
    // },
    spinner: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    container: {
        flex: 1,
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
    // confirmButton: {
    //     position: 'absolute',
    //     bottom: 0,
    //     width: Dimensions.get('window').width - dimens.margin_medium * 2,
    //     marginHorizontal: dimens.margin_medium,
    //     marginBottom: dimens.margin_medium,
    //     backgroundColor: 'rgb(0, 143, 223)',
    //     height: 44,
    //     justifyContent: 'center',
    //     borderRadius: 4,
    // },
    // confirmButtonText: {
    //     alignSelf: 'center',
    //     color: 'white',
    //     fontFamily: 'Lato-Bold',
    //     fontSize: 17,
    //     lineHeight: 21,
    // },
    // searchTextInput: {
    //     width: '100%',
    //     height: 29,
    //     marginHorizontal: dimens.margin_small,
    //     lineHeight: 21,
    //     fontSize: 15,
    //     color: 'rgb(40, 38, 51)',
    //     alignContent:'center',
    // },
    // searchTextInputContainer: {
    //     width: '100%',
    //     height: 44,
    //     backgroundColor: 'rgb(228, 241, 253)',
    // },
    // searchDescription: {
    //     fontWeight: 'bold',
    // },
    // searchListView: {
    //     backgroundColor: 'white',
    // },
    // searchContainer: {
    //     position: 'absolute',
    //     top: 0,
    //     width: '100%'
    // },
}