import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { If, Else } from 'react-if';
import { AreaListItem } from '../../components/AreaListItem';
import { Loader } from '../../components/Spinner';
import { EmptyUsersState } from '../../components/List/EmptyState';
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
    countries: PropTypes.any,
    loading: PropTypes.bool.isRequired,
  }

  state = {
    plotVisible: true,
    countries: null,
  }

  componentWillMount() {
    const { getCountries } = this.props;
    getCountries();
  }

  componentWillUnmount() {

  }

  render() {
    const { countries, history, getCountries, loading } = this.props;
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
            onChange={
              e => {
                e.target.value.length > 2 ?
                getCountries(e.target.value) :
                getCountries();
              }
            }
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
            classnames(
              'CountriesList-plot',
              'scrollbar-modified',
              { isVisible: plotVisible },
            )
          }
        >
          <If condition={!loading}>
            <div className="CountriesList-items">
              {
                countries && countries.length ?
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
                <EmptyUsersState />
              }
            </div>
            <Else>
              <div className="CountriesList-items">
                <Loader />
              </div>
            </Else>
          </If>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  countries: areaSelectors.getAreas(state),
  loading: areaSelectors.areAreasLoading(state),
});

const mapDispatchToProps = {
  getCountries: areaActions.getAreas,
};

export default connect(mapStateToProps, mapDispatchToProps)(CountriesList);
