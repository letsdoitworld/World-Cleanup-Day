import React from 'react';

import { RoundButton } from '../../components/Buttons';

import './EditLocationInput.css';

class EditLocationInput extends React.Component {
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
    if (isNaN(lat)) {
      this.setState({ error: 'Invalid latitude' });
      return;
    }
    if (isNaN(lng)) {
      this.setState({ error: 'Invalid longitude' });
      return;
    }
    if (lat >= 90 || lat <= -90) {
      this.setState({ error: 'Invalid latitude' });
      return;
    }
    if (lng >= 180 || lng <= -180) {
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
      <div
        style={{
          flexDirection: 'column',
          marginTop: '20px',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <input
            className="EditLocationInput-text"
            type="text"
            placeholder="latitude, longitude"
            onChange={this.handleInputChanged}
            value={this.state.value}
          />

          <RoundButton
            buttonStyle={{
              position: 'relative',
              left: '-30px',
              height: '20px',
              padding: '10px 30px',
            }}
            onClick={this.handleSetClicked}
            title="Set"
          />
        </div>
        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
            color: 'red',
          }}
        >
          {error}
        </div>
      </div>
    );
  }
}
export default EditLocationInput;
