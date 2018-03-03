import dimens from "../../config/dimens";

export default {
    container: {
        width: '100%',
        height: '100%'
    },
    fabStyle: {
        width: '100%',
        height: '60%'
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