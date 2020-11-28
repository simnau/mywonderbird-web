import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import AsyncCreatableSelect from 'react-select/async-creatable';
import styled from 'styled-components';
import debouncePromise from 'debounce-promise';

import { getResizedImages } from '../../../../util/image';
import { get, post, put } from '../../../../util/fetch';
import { H3 } from '../../../../components/typography';
import { Button } from '../../../../components/button';
import { TextField } from '../../../../components/input';
import { CenteredContainer } from '../../../../components/layout/containers';
import Loader from '../../../../components/loader';
import LocationMap from './location-map';
import Images from './images';

const RootContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const Form = styled.form`
  padding: 8px;
  display: grid;
  grid-row-gap: 8px;
`;

function CreateEditPlace({ id }) {
  const state = useObservable({
    titleObject: null,
    lng: null,
    lat: null,
    country: null,
    source: '',
    tags: [],
    selectedTags: [],
    images: [],
    isLoading: true,
  });
  const history = useHistory();

  useEffect(() => {
    const loadTags = async () => {
      const { data } = await get('/api/tags');

      state.tags = data.tags.map(tag => {
        return {
          value: tag.id,
          label: tag.title,
        };
      });
    };

    const loadPlace = async id => {
      const { data } = await get(`/api/places/${id}`);

      if (data.place) {
        const { place } = data;

        state.country = {
          country: place.country,
          countryCode: place.countryCode,
        };
        state.lat = place.lat;
        state.lng = place.lng;
        state.titleObject = {
          label: place.title,
          value: place.title,
          __isNew__: true,
        };
        state.selectedTags = place.placeTags.map(placeTag => ({
          value: placeTag.tag.id,
          label: placeTag.tag.title,
        }));
        state.images = place.placeImages;
        state.source = place.source || '';
      }
    };

    const promises = [loadTags()];

    if (id) {
      promises.push(loadPlace(id));
    }

    Promise.all(promises).then(() => {
      state.isLoading = false;
    });
  }, []);

  const createPlace = async event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', state.titleObject.label);
    formData.append('lat', state.lat);
    formData.append('lng', state.lng);
    formData.append('countryCode', state.country.countryCode);
    formData.append('source', state.source);
    if (state.selectedTags && state.selectedTags.length) {
      formData.append(
        'placeTags',
        JSON.stringify(
          state.selectedTags.map(tag => ({
            tagId: tag.value,
          })),
        ),
      );
    }
    state.images.forEach(file => {
      formData.append(file.file.name, file.file);
    });

    await post('/api/places', formData);
    history.push('/admin/places');
  };

  const editPlace = async event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', state.titleObject.label);
    formData.append('lat', state.lat);
    formData.append('lng', state.lng);
    formData.append('countryCode', state.country.countryCode);
    formData.append('source', state.source);

    if (state.selectedTags && state.selectedTags.length) {
      formData.append(
        'placeTags',
        JSON.stringify(
          state.selectedTags.map(tag => ({
            tagId: tag.value,
          })),
        ),
      );
    }

    const newImages = state.images.filter(image => image.isNew);
    const oldImages = state.images.filter(image => !image.isNew);

    formData.append('placeImages', JSON.stringify(oldImages));
    newImages.forEach(file => {
      formData.append(file.file.name, file.file);
    });

    await put(`/api/places/${id}`, formData);
    history.push('/admin/places');
  };

  const getCountry = async location => {
    if (!location) {
      return;
    }

    const { data } = await get('/api/geo/places/country', {
      location: `${location.lat},${location.lng}`,
    });

    return data;
  };

  const onSelectLocation = async (event, location) => {
    if (!location) {
      state.lat = null;
      state.lng = null;
      return;
    }

    state.lat = location.lngLat.lat;
    state.lng = location.lngLat.lng;

    const countryInfo = await getCountry({
      lat: location.lngLat.lat,
      lng: location.lngLat.lng,
    });

    if (!countryInfo) {
      state.lat = null;
      state.lng = null;
      state.country = null;
      return;
    }

    state.country = countryInfo;
  };

  const onChangeTag = newValue => {
    state.selectedTags = newValue;
  };

  const onFieldChange = event => {
    state[event.target.name] = event.target.value;
  };

  const onTitleChange = value => {
    if (value.country && value.countryCode) {
      state.country = {
        country: value.country,
        countryCode: value.countryCode,
      };
    }

    if (value.location) {
      state.lat = value.location.lat;
      state.lng = value.location.lng;
    }

    state.titleObject = value;
  };

  const onImagesSelected = async value => {
    const resizedImages = await getResizedImages(Object.values(value));
    state.images = [
      ...resizedImages.map(resizedImage => ({
        id: resizedImage.name,
        file: resizedImage,
        preview: URL.createObjectURL(resizedImage),
        isNew: true,
      })),
      ...state.images,
    ];
  };

  const onRemoveImage = index => {
    state.images.splice(index, 1);
  };

  const findPlaces = async value => {
    if (!value) {
      return;
    }

    const { data } = await get('/api/geo/places/search', {
      q: value,
    });

    return data.map(place => ({
      label: place.name,
      value: place.id,
      ...place,
    }));
  };

  const debouncedFindPlaces = debouncePromise(findPlaces, 300);

  const locationText =
    state.lat && state.lng
      ? `${state.lat}, ${state.lng}`
      : 'No location selected';
  const countryText = state.country
    ? state.country.country
    : 'No location selected';
  const location =
    state.lat && state.lng ? { lat: state.lat, lng: state.lng } : null;

  const loader = () => {
    return (
      <CenteredContainer height="400px">
        <Loader />
      </CenteredContainer>
    );
  };

  if (state.isLoading) {
    return loader();
  }

  return (
    <RootContainer>
      <div>
        <H3>{id ? 'Edit place' : 'Create place'}</H3>
        <Form onSubmit={id ? editPlace : createPlace}>
          <div>
            <div
              style={{
                fontSize: 14,
                color: 'gray',
                fontWeight: 'bold',
                marginBottom: 4,
              }}
            >
              Title
            </div>
            <AsyncCreatableSelect
              value={state.titleObject}
              onChange={onTitleChange}
              loadOptions={debouncedFindPlaces}
            />
          </div>
          <TextField
            label="Location"
            name="location"
            value={locationText}
            type="text"
            disabled
          />
          <TextField
            label="Country"
            name="country"
            value={countryText}
            type="text"
            disabled
          />
          <TextField
            label="Source"
            name="source"
            value={state.source}
            type="text"
            onChange={onFieldChange}
            placeholder="Place source"
          />
          <div>
            <div
              style={{
                fontSize: 14,
                color: 'gray',
                fontWeight: 'bold',
                marginBottom: 4,
              }}
            >
              Tags
            </div>
            <Select
              value={state.selectedTags}
              closeMenuOnSelect={false}
              isMulti
              options={state.tags}
              onChange={onChangeTag}
            />
          </div>
          <Images
            images={state.images}
            onImagesSelected={onImagesSelected}
            onRemoveImage={onRemoveImage}
          />
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </div>
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 64px)',
          position: 'sticky',
          top: 64,
          zIndex: 1,
          paddingBottom: 8,
          backgroundColor: 'white',
        }}
      >
        <LocationMap onClick={onSelectLocation} location={location} />
      </div>
    </RootContainer>
  );
}

export default observer(CreateEditPlace);
