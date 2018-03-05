import dimens from "../../config/dimens";

export default {
    containerProgress: {
        flex: 1,
        justifyContent: 'center'
    },
    containerContent: {
        flex: 1,
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    searchContainerStyle: {
        backgroundColor: "rgb(228, 241, 253)"
    },
    vertical: {
        flexDirection: 'column',
       // justifyContent: 'space-around',
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
    searchField: {
        backgroundColor: 'white',
        flex: 1,
        height: 29,
        paddingVertical: 0,
        paddingHorizontal: dimens.margin_small,
        margin: dimens.margin_small,
        borderRadius: 5,
        fontFamily: "Lato-Regular",
        color: 'rgb(40, 38, 51)',
        fontSize: 15,
        lineHeight: 21,
    }
}