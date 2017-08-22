import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import _ from 'lodash';

class AreaListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  getContainerStyle = () => {
    let containerStyle = {};
    if (this.props.index % 2 === 1) {
      containerStyle = {
        backgroundColor: '#F6F6F6',
      };
    }
    return containerStyle;
  };
  getToggleStyle = () => {
    const { area } = this.props;
    const hasChildren = area.children && area.children.length > 0;
    if (hasChildren) {
      return { cursor: 'pointer' };
    }
    return {};
  };
  handleCollapseToggleClick = () => {
    if (!this.props.area.children || this.props.area.children.length === 0) {
      return;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  renderRightLabel = () => {
    const { area } = this.props;
    if (!area || !area.trashCount) {
      return '0';
    }
    return String(area.trashCount);

    // const { rightLabel } = this.props;
    // if (_.isFunction(rightLabel)) {
    //   return rightLabel(this.props.area);
    // }
    // return rightLabel;
  };

  render() {
    const { onClick, area, rightLabel } = this.props;
    const hasChildren = area.children && area.children.length > 0;

    return (
      <div>
        <div style={this.getContainerStyle()} className="AreaListItem">
          <div
            onClick={this.handleCollapseToggleClick}
            className="AreaListItem-toggle-container"
            style={this.getToggleStyle()}
          >
            <div
              className="AreaListItem-left-padding"
              style={{ width: this.props.leftPadding }}
            />
            <div className="AreaListItem-collapse-toggle">
              {hasChildren &&
                <div
                  className={
                    this.state.isOpen
                      ? 'AreaListItem-triangle-up'
                      : 'AreaListItem-triangle-down'
                  }
                />}
            </div>
            <div className="AreaListItem-text-container">
              <span
                style={{ fontWeight: this.state.isOpen ? 'bold' : 'normal' }}
                className="AreaListItem-header"
              >
                {area.name}
              </span>
            </div>
          </div>
          {!!rightLabel &&
            <div
              onClick={() => onClick(area)}
              className="AreaListItem-trashlist-button"
            >
              {this.renderRightLabel()}
            </div>}
        </div>
        {hasChildren &&
          <Collapse isOpened={this.state.isOpen}>
            {area.children.map((a, i) =>
              (<AreaListItem
                leftPadding={this.props.leftPadding + 10}
                rightLabel={this.props.rightLabel}
                key={a.id}
                index={i + 1}
                area={a}
                onClick={onClick}
              />),
            )}
          </Collapse>}
      </div>
    );
  }
}
AreaListItem.defaultProps = {
  leftPadding: 0,
  rightLabel: 'View',
};
AreaListItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  area: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  leftPadding: PropTypes.number,
  rightLabel: PropTypes.oneOf(PropTypes.func, PropTypes.string),
};
export default AreaListItem;
