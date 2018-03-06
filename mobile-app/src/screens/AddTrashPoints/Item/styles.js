import dimens from "../../../config/dimens";

export default {
    itemTouch: {
        height: 79,
    },
    itemContent: {
        flexDirection: 'row',
        marginHorizontal: dimens.margin_medium,
        flex: 1,
        alignItems: 'center'
    },
    status: {
        width: 40,
        height: 40,
        marginRight: dimens.margin_medium,
    },
    pin: {
        width: 20,
        height: 20,
        marginRight: 3,
    },
    title: {
        fontFamily: "Lato-Regular",
        color: 'rgb(0, 143, 223)',
        fontSize: 15,
        lineHeight: 14,
        flex: 1,
    },
    checkbox: {
        width: 49,
        height: 29,
        marginLeft: 33
    }
}