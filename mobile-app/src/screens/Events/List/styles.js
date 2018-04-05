import dimens from "../../../config/dimens";

export default {
    containerProgress: {
        flex: 1,
        justifyContent: 'center'
    },
    containerContent: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    searchContainerStyle: {
        backgroundColor: "rgb(228, 241, 253)",
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
    listDivider: {
        height: 1,
        backgroundColor: 'rgb(229, 229, 233)',
    },
    paginationFooter: {
        height: 86,
    },
    list: {
        flex: 1
    },
    spinner: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
}