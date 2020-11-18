import React, { useEffect } from 'react';
import { useObservable, observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { get, del } from '../../../util/fetch';
import TagListItem from './components/tag-list-item';
import { Button } from '../../../components/button';
import { H3, H4 } from '../../../components/typography';
import { CenteredContainer } from '../../../components/layout/containers';
import Loader from '../../../components/loader';

const TagsContainer = styled.div`
  margin-bottom: 48px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;

  > :not(:last-child) {
    margin-right: 8px;
  }
`;

async function fetchTags() {
  const {
    data: { tags },
  } = await get('/api/tags');

  return tags;
}

function TagsPage() {
  const state = useObservable({
    tags: [],
    isLoading: true,
  });

  const loadTags = async () => {
    state.isLoading = true;
    const tags = await fetchTags();

    state.tags = tags;
    state.isLoading = false;
  };

  useEffect(() => {
    loadTags();
  }, []);

  const deleteTag = async id => {
    await del(`/api/tags/${id}`);
    loadTags();
  };

  return (
    <TagsContainer>
      <HeaderContainer>
        <H3>Tags</H3>
        <Button variant="primary" as={Link} to="/admin/tags/create">
          Create tag
        </Button>
      </HeaderContainer>
      {state.isLoading && (
        <CenteredContainer>
          <Loader />
        </CenteredContainer>
      )}
      {!state.isLoading && !!state.tags.length && (
        <div>
          {state.tags.map(tag => (
            <TagListItem
              key={tag.id}
              tag={tag}
              deleteTag={deleteTag}
              editLink={`/admin/tags/${tag.id}/edit`}
            />
          ))}
        </div>
      )}
      {!state.isLoading && !state.tags.length && (
        <CenteredContainer>
          <H4>There are no tags</H4>
        </CenteredContainer>
      )}
      <Button variant="primary" as={Link} to="/admin/tags/create">
        Create tag
      </Button>
    </TagsContainer>
  );
}

export default observer(TagsPage);
