import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { getResizedImages } from '../../../../util/image';
import { get, post, put } from '../../../../util/fetch';
import { H3 } from '../../../../components/typography';
import { Button } from '../../../../components/button';
import FileSelectButton from '../../../../components/file-select-button';
import { TextField } from '../../../../components/input';
import { CenteredContainer } from '../../../../components/layout/containers';
import Loader from '../../../../components/loader';

const RootContainer = styled.div``;

const Form = styled.form`
  padding: 8px;
  display: grid;
  grid-row-gap: 8px;
`;

function CreateEditTag({ id }) {
  const state = useObservable({
    title: '',
    code: '',
    imageUrl: null,
    imageFile: null,
    isLoading: false,
  });
  const history = useHistory();

  useEffect(() => {
    const loadTag = async id => {
      const { data } = await get(`/api/tags/${id}`);

      if (data.tag) {
        const { tag } = data;

        state.title = tag.title;
        state.code = tag.code;
        state.imageUrl = tag.imageUrl;
      }
    };

    if (id) {
      state.isLoading = true;

      loadTag(id).then(() => {
        state.isLoading = false;
      });
    }
  }, []);

  const createTag = async event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', state.title);
    formData.append('code', state.code);

    if (state.imageFile) {
      formData.append(state.imageFile.file.name, state.imageFile.file);
    }

    await post('/api/tags', formData);
    history.push('/admin/tags');
  };

  const editTag = async event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', state.title);
    formData.append('code', state.code);

    if (!state.imageFile) {
      formData.append('imageUrl', state.imageUrl);
    }

    if (state.imageFile) {
      formData.append(state.imageFile.file.name, state.imageFile.file);
    }

    await put(`/api/tags/${id}`, formData);
    history.push('/admin/tags');
  };

  const onFieldChange = event => {
    state[event.target.name] = event.target.value;
  };

  const onImageSelected = async value => {
    const [resizedImage] = await getResizedImages(Object.values(value));

    state.imageFile = {
      file: resizedImage,
      preview: URL.createObjectURL(resizedImage),
    };
  };

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
      <H3>{id ? 'Edit tag' : 'Create tag'}</H3>
      <Form onSubmit={id ? editTag : createTag}>
        <TextField
          label="Title"
          name="title"
          value={state.title}
          type="text"
          onChange={onFieldChange}
          placeholder="Tag title"
        />
        <TextField
          label="Code"
          name="code"
          value={state.code}
          type="text"
          onChange={onFieldChange}
          placeholder="Tag code"
        />
        <FileSelectButton onSelect={onImageSelected}>
          {state.imageFile || state.imageUrl ? 'Change image' : 'Add image'}
        </FileSelectButton>
        {(state.imageFile || state.imageUrl) && (
          <img
            src={state.imageFile ? state.imageFile.preview : state.imageUrl}
            style={{
              height: 300,
              width: 300,
              objectFit: 'cover',
              borderRadius: 8,
              marginBottom: 8,
            }}
          />
        )}
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </RootContainer>
  );
}

export default observer(CreateEditTag);
