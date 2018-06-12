import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AreaListItem } from '../../components/AreaListItem';
import {
  selectors as areaSelectors,
  actions as areaActions,
} from '../../reducers/areas';
import {
  SearchIcon,
  ExpandIcon,
} from '../../components/common/Icons';
import './CountriesList.css';

class CountriesList extends Component {

  componentWillMount() {
    const { getCountries } = this.props;
    getCountries();
  }

  render() {
    const { countries, history } = this.props;
    return (
      <div className="CountriesList-container">
        <div className="CountriesList-header">
          <SearchIcon />
          <input
            className="UsersList-search-input"
            type="text"
            name="search"
            placeholder="Search areas"
          />
          <div className="AreaList-minimize">
            <ExpandIcon />
          </div>
        </div>
        <div className="CountriesList-plot">
          <div className="AreaAssignList-items">
            {
              countries ?
              countries.filter(c => !c.parentId).map((c, i) => {
                return (
                  <AreaListItem
                    onClick={
                      () => history.push(`/countries/users?area=${c.id}`)
                    }
                    index={i}
                    area={c}
                    key={c.id}
                  />
                );
              }) :
              <div>Loading</div>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  countries: areaSelectors.getAreas(state),
});

const mapDispatchToProps = {
  getCountries: areaActions.getAreas,
};

export default connect(mapStateToProps, mapDispatchToProps)(CountriesList);
