import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Link } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import styled from 'styled-components';
import debounce from 'debounce';
import qs from 'qs';

import { get, del, post } from '../../../util/fetch';
import PlaceListItem from './components/place-list-item';
import { Button } from '../../../components/button';
import { TextField } from '../../../components/input';
import FileSelectButton from '../../../components/file-select-button';
import { H3, H4 } from '../../../components/typography';
import { CenteredContainer } from '../../../components/layout/containers';
import Loader from '../../../components/loader';
import Pagination from '../../../components/pagination';

const DEFAULT_PAGE_SIZE = 20;

const PlacesContainer = styled.div`
  margin-bottom: 48px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;

  > :not(:last-child) {
    margin-right: 8px;
  }
`;

const FilterForm = styled.form`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: start;
  grid-column-gap: 8px;
`;

async function fetchPlaces({
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  q,
  countryCode,
  tags,
}) {
  const {
    data: { total, places },
  } = await get('/api/places', { page, pageSize, q, countryCode, tags });

  return { total, places };
}

class PlacesPage extends React.Component {
  observableState = observable({
    page: 1,
    total: 0,
    places: [],
    isLoading: true,
    tags: [],
    filters: {
      search: '',
      country: null,
      selectedTags: [],
    },
  });

  constructor(props) {
    super(props);

    this.debouncedAfterFilterChange = debounce(this.afterFilterChange, 300);
  }

  componentDidMount() {
    const queryParams = qs.parse(this.props.location.search.substring(1));

    Promise.all([
      this.loadPlaces({
        page: queryParams.page,
        q: queryParams.q,
        countryCode: queryParams.countryCode,
        tags: queryParams.tags,
      }),
      this.loadTags(),
    ]).then(() => {
      this.setQueryState(queryParams);
    });
  }

  componentDidUpdate(prevProps) {
    const prevQueryParams = qs.parse(prevProps.location.search.substring(1));
    const queryParams = qs.parse(this.props.location.search.substring(1));

    if (this.filterChanged(prevQueryParams, queryParams)) {
      this.loadPlaces({
        page: queryParams.page,
        q: queryParams.q,
        countryCode: queryParams.countryCode,
        tags: queryParams.tags,
      });
      this.setQueryState(queryParams);
    }
  }

  loadTags = async () => {
    const { data } = await get('/api/tags');

    this.observableState.tags = data.tags.map(tag => {
      return {
        value: tag.code,
        label: tag.title,
      };
    });
  };

  filterChanged = (prevFilters, filters) => {
    if (prevFilters.page !== filters.page) {
      return true;
    }

    if (prevFilters.q !== filters.q) {
      return true;
    }

    if (prevFilters.countryCode !== filters.countryCode) {
      return true;
    }

    if (!prevFilters.tags && !filters.tags) {
    } else if (
      (!prevFilters.tags && filters.tags) ||
      (prevFilters.tags && !filters.tags)
    ) {
      return true;
    } else if (prevFilters.tags.length !== filters.tags.length) {
      return true;
    } else if (prevFilters.tags.some(tag => !filters.tags.includes(tag))) {
      return true;
    }

    return false;
  };

  setQueryState = async queryParams => {
    if (queryParams.page) {
      this.observableState.page = parseInt(queryParams.page, 10);
    }

    if (queryParams.q) {
      this.observableState.filters.search = queryParams.q;
    }

    if (
      queryParams.countryCode &&
      (!this.observableState.country ||
        this.observableState.country.value != queryParams.countryCode)
    ) {
      const country = await this.findCountryByCode(queryParams.countryCode);
      this.observableState.filters.country = country;
    }

    if (queryParams.tags) {
      const selectedTags = queryParams.tags
        .map(tagCode => {
          return this.observableState.tags.find(tag => tag.value === tagCode);
        })
        .filter(tag => !!tag);

      this.observableState.filters.selectedTags = selectedTags;
    }
  };

  loadPlaces = async ({ page, q, countryCode, tags }) => {
    this.observableState.isLoading = true;
    const { total, places } = await fetchPlaces({
      page,
      q,
      countryCode,
      tags,
    });

    this.observableState.total = total;
    this.observableState.places = places;
    this.observableState.isLoading = false;
  };

  onPageSelect = page => {
    this.observableState.page = page;
    this.onSearch({ resetPage: false });
  };

  onSelectCSV = async files => {
    const formData = new FormData();
    Object.values(files).forEach(file => {
      formData.append(file.name, file);
    });

    await post('/api/places/csv', formData);

    const {
      page,
      filters: { country, search, selectedTags },
    } = this.observableState;

    this.loadPlaces({
      page,
      countryCode: country ? country.value : null,
      q: search,
      tags: selectedTags,
    });
  };

  deletePlace = async id => {
    await del(`/api/places/${id}`);

    const {
      page,
      filters: { country, search, selectedTags },
    } = this.observableState;

    this.loadPlaces({
      page,
      countryCode: country ? country.value : null,
      q: search,
      tags: selectedTags,
    });
  };

  findCountryByCode = async code => {
    const { data } = await get(`/api/geo/countries/${code}`);
    return data.country;
  };

  searchCountries = async inputValue => {
    const { data } = await get('/api/geo/countries/search', {
      q: inputValue.trim(),
    });
    return data;
  };

  onSubmitFilters = event => {
    event.preventDefault();
    this.onSearch();
  };

  onSearch = ({ resetPage = true } = {}) => {
    const { page, filters } = this.observableState;

    const search = {};

    if (page) {
      search.page = resetPage ? 1 : page;
    }

    if (filters.search) {
      search.q = filters.search;
    }

    if (filters.country) {
      search.countryCode = filters.country.value;
    }

    if (filters.selectedTags && filters.selectedTags.length) {
      search.tags = filters.selectedTags.map(tag => tag.value);
    }

    this.props.history.push({
      pathname: '/admin/places',
      search: `?${qs.stringify(search)}`,
    });
  };

  handleFilterChange = event => {
    this.observableState.filters[event.target.name] = event.target.value;
    this.observableState.page = 1;
  };

  handleCountryFilterChange = selectedCountry => {
    this.observableState.filters.country = selectedCountry;
    this.observableState.page = 1;
  };

  handleChangeTag = tags => {
    this.observableState.filters.selectedTags = tags;
  };

  render() {
    const {
      places,
      isLoading,
      page,
      total,
      tags,
      filters: { search, country, selectedTags },
    } = this.observableState;

    return (
      <PlacesContainer>
        <HeaderContainer>
          <H3>Places</H3>
          <div
            style={{
              display: 'flex',
            }}
          >
            <Button
              variant="primary"
              as={Link}
              to="/admin/places/create"
              style={{ marginRight: 8 }}
            >
              Create place
            </Button>
            <FileSelectButton onSelect={this.onSelectCSV} accept={['.csv']}>
              Create from CSV
            </FileSelectButton>
          </div>
        </HeaderContainer>
        <div>
          <H3>Filter locations</H3>
          <FilterForm onSubmit={this.onSubmitFilters}>
            <TextField
              name="search"
              placeholder="Search by title"
              value={search}
              type="text"
              onChange={this.handleFilterChange}
            />
            <AsyncSelect
              cacheOptions
              loadOptions={this.searchCountries}
              placeholder="Filter by country"
              onChange={this.handleCountryFilterChange}
              value={country}
              isClearable
            />
            <Select
              value={selectedTags}
              closeMenuOnSelect={false}
              isMulti
              options={tags}
              onChange={this.handleChangeTag}
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
          </FilterForm>
        </div>
        {isLoading && (
          <CenteredContainer>
            <Loader />
          </CenteredContainer>
        )}
        {!isLoading && !!places.length && (
          <div>
            {places.map(place => (
              <PlaceListItem
                key={place.id}
                place={place}
                deletePlace={this.deletePlace}
                editLink={`/admin/places/${place.id}/edit`}
              />
            ))}
            <Pagination
              page={page}
              pageSize={DEFAULT_PAGE_SIZE}
              total={total}
              onPageSelect={this.onPageSelect}
            />
          </div>
        )}
        {!isLoading && !places.length && (
          <CenteredContainer>
            <H4>There are no places</H4>
          </CenteredContainer>
        )}
        <Button variant="primary" as={Link} to="/admin/places/create">
          Create place
        </Button>
      </PlacesContainer>
    );
  }
}

export default observer(PlacesPage);
