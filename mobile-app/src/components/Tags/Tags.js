/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Tips from 'react-native-tips';
import Tag from './Tag';
import styles from './styles';
import strings from '../../assets/strings';
import { getNavBarHeight } from '../../shared/helpers';

const originTypes = {
  household: 'household',
  nonhousehold: 'non-household',
  construction: 'construction and demolition',
};

class Tags extends React.Component {
  constructor() {
    super();
    this.state = { visibleIndex: undefined };
  }

  getOriginDescription = (type) => {
    switch (type) {
      case originTypes.household:
        return strings.label_tag_household_description;
      case originTypes.nonhousehold:
        return strings.label_tag_non_household_description;
      case originTypes.construction:
        return strings.label_tag_construction_description;
      default:
        return undefined;
    }
  };

  render() {
    const {
      tags,
      onTagSelect = _.noop,
      onTagDelete,
      tagCustomStyles,
    } = this.props;
    return (
      <View style={styles.container}>
        {tags && tags.map((tag, index) => {
          const onSelect = onTagSelect(index);
          let onDelete;
          if (onTagDelete) {
            onDelete = onTagDelete(index);
          }
          return <View>
            <Tips
              offsetTop={getNavBarHeight()}
              textStyle={styles.tooltipText}
              tooltipArrowStyle={styles.tooltipArrow}
              tooltipContainerStyle={styles.toolTipContainer}
              style={styles.tipsStyle}
              onRequestClose={() => {
                this.setState({ visibleIndex: undefined });
              }}
              enableChildrenInteraction
              modalStyle={styles.tooltipModalStyle}
              visible={this.state.visibleIndex === index}
              text={this.getOriginDescription(tag.type)}
            >
              <Tag
                onSelect={() => {
                  onSelect(index);
                  if (!tag.selected && this.props.isTooltipEnabled) {
                    this.setState({ visibleIndex: index });
                  }
                }}
                {...tag}
                key={index}
                onDelete={onDelete}
                customStyles={tagCustomStyles}
              />
            </Tips>
          </View>;
        })}
      </View>
    );
  }
}

Tags.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      selected: PropTypes.bool,
    }),
  ),
  onTagDelete: PropTypes.func,
  onTagSelect: PropTypes.func,
  isTooltipEnabled: PropTypes.bool,
};

export default Tags;
