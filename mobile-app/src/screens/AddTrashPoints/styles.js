import dimens from "../../config/dimens";

export default {
    containerProgress: {
        flex: 1,
        justifyContent: 'center'
    },
    containerContent: {
        flex: 1,
        backgroundColor: "rgb(255, 255, 255)"
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
    },
    listDivider: {
        height: 1,
        backgroundColor: 'rgb(229, 229, 233)',
    },
    paginationFooter: {
        height: 86,
    },
    list: {
        flex: 1,
    },
    spinner: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterContainer: {
        width: '100%',
        height: 30,
        backgroundColor: 'rgb(0, 143, 223)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    counter: {
        fontFamily: 'Lato-Bold',
        fontSize: 15,
        color: 'white',
    }
}