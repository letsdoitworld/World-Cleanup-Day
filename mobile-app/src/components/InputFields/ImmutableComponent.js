// @flow
import { PureComponent } from 'react';


/* PureComponent does shallow equals check on all state object keys.
 * It will work in simple case when the state object is one-level deep.
 * So we just store our immutable state as a child of the plain js object
 */

export default class ImmutableComponent extends PureComponent {
    state = undefined;

    setData(updater) {
      this.setState(state => ({
        data: updater(state.data),
      }));
    }

    setDataWithCallback(updater, callback) {
      this.setState(state => ({
        data: updater(state.data),
      }), callback);
    }

    dataValue(key) {
      return this.state && this.state.data.get(key);
    }
}
