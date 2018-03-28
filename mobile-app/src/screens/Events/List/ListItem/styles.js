import dimens from "../../../../config/dimens";

export default {
    itemTouch: {
        height: 104
    },
    itemTouchParticipant: {
        height: 104,
        backgroundColor: 'rgb(232, 232, 232)'
    },
    itemContent: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    image: {
        width: 84,
        height: 84,
        margin: 10,
        borderRadius: 4,
        overflow: 'hidden'
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        width: 144,
        height: 36,
        fontFamily: "Lato-Heavy",
        color: 'rgb(40, 38, 51)',
        fontSize: 15,
        textAlign: 'left',
        letterSpacing: -0.2,
        marginTop: 12,
    },
    organizationText: {
        fontFamily: "Lato-Regular",
        color: 'rgb(0, 27, 1)',
        fontSize: 12,
        lineHeight: 14,
        textAlign: 'left',
    },
    placeText: {
        fontFamily: "Lato-Regular",
        color: 'rgb(126, 124, 132)',
        fontSize: 12,
        lineHeight: 14,
        textAlign: 'left',
    },
    pin: {
        width: dimens.margin_medium,
        height: dimens.margin_medium,
        marginRight: 4
    },
    organizationIcon: {
        width: dimens.margin_medium,
        height: dimens.margin_medium,
        marginRight: 4
    },
    placeRow: {
        flexDirection: 'row',
        marginTop: 4,
        alignItems: 'center',
        flex: 1,
        marginBottom: 11
    },
    organizationRow: {
        flexDirection: 'row',
        marginTop: dimens.margin_small,
        alignItems: 'center',
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'column',
        flex: 1,
        margin: 12,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 80
    },
    available: {
        width:61,
        height: 26,
        fontFamily: "Lato-Bold",
        color: 'rgb(40, 38, 51)',
        fontSize: 12,
        lineHeight: 14,
        textAlign: 'center',
        paddingTop: 5,
        backgroundColor: 'rgb(255, 170, 28)',
        borderRadius: 13,
        overflow: 'hidden'
    },
    availableParticipant: {
        width:61,
        height: 26,
        fontFamily: "Lato-Bold",
        color: 'white',
        fontSize: 12,
        lineHeight: 14,
        textAlign: 'center',
        paddingTop: 5,
        backgroundColor: 'rgb(126, 124, 132)',
        borderRadius: 13,
        overflow: 'hidden'
    },
    date: {
        fontFamily: "Lato-Bold",
        color: 'rgb(40, 38, 51)',
        fontSize: 12,
        lineHeight: 14,
        textAlign: 'left',
    }
}