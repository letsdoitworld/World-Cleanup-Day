import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { AreaListItem } from '../../components/AreaListItem';
import { Loader } from '../../components/Spinner';
import {
  selectors as areaSelectors,
  actions as areaActions,
} from '../../reducers/areas';
import {
  SearchIcon,
  ExpandIcon,
  CollapseIcon,
} from '../../components/common/Icons';
import './CountriesList.css';

class CountriesList extends Component {

  static propTypes = {
    history: PropTypes.any.isRequired,
    getCountries: PropTypes.func.isRequired,
    countries: PropTypes.any.isRequired,
  }

  state = {
    plotVisible: true,
  }

  componentWillMount() {
    const { getCountries } = this.props;
    getCountries();
  }

  render() {
    const { countries, history } = this.props;
    const { plotVisible } = this.state;
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
          <div
            className="AreaList-minimize"
            onClick={
              () => this.setState({ plotVisible: !this.state.plotVisible })
            }
          >
            {
              plotVisible ?
                <CollapseIcon /> :
                <ExpandIcon />
            }
          </div>
        </div>
        <div className={
            classnames('CountriesList-plot', { isVisible: plotVisible })
          }
        >
          <div className="CountriesList-items">
            {
              countries ?
              countries.filter(c => !c.parentId).map((c, i) => {
                return (
                  <AreaListItem
                    onBodyClick={
                      () => history.push(`/countries/users?area=${c.id}`)
                    }
                    index={i}
                    area={c}
                    key={c.id}
                  />
                );
              }) :
              <Loader />
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
