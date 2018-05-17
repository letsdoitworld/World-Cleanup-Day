import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './EditLocationInput.css';

class EditLocationInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }
  handleInputChanged = ev => {
    this.setState({
      value: ev.target.value,
    });
  };
  handleSetClicked = () => {
    const { value } = this.state;
    const latlngString = value.replace(/ */g, '').split(/, ?/);
    if (latlngString.length !== 2) {
      this.setState({ error: 'Missing colon between the 2 numbers' });
      return;
    }
    const latlng = latlngString.map(i => parseFloat(i, 10));

    const [lat, lng] = latlng;
    if (isNaN(lat) || lat >= 90 || lat <= -90) {
      this.setState({ error: 'Invalid latitude' });
      return;
    }
    if (isNaN(lng) || lng >= 180 || lng <= -180) {
      this.setState({ error: 'Invalid longitude' });
      return;
    }

    if (!this.props.onChange) {
      return;
    }
    this.props.onChange({ lat, lng });
    this.setState({ value: '', error: '' });
  };
  render() {
    const { error } = this.state;
    return (
      <div className="EditLocationInput-parent">
        <div className="EditLocationInput">
          <input
            className="EditLocationInput-text"
            type="text"
            placeholder="latitude, longitude"
            onChange={this.handleInputChanged}
            value={this.state.value}
          />
          <div
            onClick={this.handleSetClicked}
            className="EditLocation-btn"
          >
            <p className="EditLocation-btn-text">Set</p>
          </div>
        </div>
        <div
          className={classnames('EditLocation-error', {
            'd-b': error,
            'd-n': !error,
          })}
        >
          {error}
        </div>
      </div>
    );
  }
}
export default EditLocationInput;
