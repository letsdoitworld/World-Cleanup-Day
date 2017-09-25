import React from 'react';

import { RoundButton } from '../../components/Buttons';

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
      return;
    }
    const latlng = latlngString.map(i => parseFloat(i, 10));

    const [lat, lng] = latlng;
    if (isNaN(lat) || isNaN(lng)) {
      return;
    }
    if (lat >= 90 || lat <= -90 || lng >= 180 || lng <= -180) {
      return;
    }
    if (!this.props.onChange) {
      return;
    }
    this.props.onChange({ lat, lng });
    this.setState({ value: '' });
  };
  render() {
    return (
      <div
        style={{
          marginTop: '20px',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <input
          type="text"
          placeholder="latitude, longitude"
          onChange={this.handleInputChanged}
          value={this.state.value}
        />

        <RoundButton
          buttonStyle={{ height: '23px', padding: '10px 30px' }}
          onClick={this.handleSetClicked}
          title="Set"
        />
      </div>
    );
  }
}
export default EditLocationInput;
