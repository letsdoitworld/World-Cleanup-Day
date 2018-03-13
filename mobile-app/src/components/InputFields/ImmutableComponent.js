// @flow
import {PureComponent} from "react";
import {Map} from "immutable";


/* PureComponent does shallow equals check on all state object keys.
 * It will work in simple case when the state object is one-level deep.
 * So we just store our immutable state as a child of the plain js object
 */
type Data = Map<string, any>;
type State = { data: Data } | void;

export default class ImmutableComponent extends PureComponent {

    state: State = undefined;

    setData(updater: (Data) => Data) {
        this.setState((state) => ({
            data: updater(state.data)
        }));
    }

    setData(updater: (Data) => Data, callback) {
        this.setState((state) => ({
            data: updater(state.data)
        }), callback);
    }

    dataValue(key: string) {
        return this.state && this.state.data.get(key);
    }



}
