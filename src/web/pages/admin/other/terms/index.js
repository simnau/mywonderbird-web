import React, { useEffect } from 'react';
import styled from 'styled-components';
import { observer, useObservable } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import * as moment from 'moment';

import { get, del } from '../../../../util/fetch';
import { H3, H4 } from '../../../../components/typography';
import { CenteredContainer } from '../../../../components/layout/containers';
import Loader from '../../../../components/loader';
import { Button, OutlineButton } from '../../../../components/button';

const ListContainer = styled.div`
  margin-bottom: 16px;
`;

const ListHeader = styled.div`
  padding: 16px 8px;
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 1fr;
  font-size: 18px;
  border-bottom: 1px solid lightgray;
  color: gray;
`;

const ListRow = styled.div`
  padding: 16px 8px;
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 1fr;
  font-size: 16px;
`;

const ListActionContainer = styled.div`
  display: grid;
  grid-row-gap: 8px;
`;

const fetchTerms = async () => {
  return get('/api/terms');
};

function Terms() {
  const state = useObservable({
    terms: [],
    isLoading: false,
  });

  const setStateData = result => {
    const { data } = result;

    state.terms = state.terms.concat(data);
  };

  const loadTerms = async () => {
    state.isLoading = true;
    const result = await fetchTerms();
    setStateData(result);
    state.isLoading = false;
  };

  useEffect(() => {
    loadTerms();
  }, []);

  const deleteTerms = async termsId => {
    await del(`/api/terms/${termsId}`);
    state.terms = [];
    await loadTerms();
  };

  return (
    <div>
      <H3>Terms</H3>
      <ListContainer>
        <ListHeader>
          <div>Type</div>
          <div>Url</div>
          <div>Date</div>
          <div />
        </ListHeader>
        {state.terms.map(term => {
          return (
            <ListRow key={term.id}>
              <div>{term.type}</div>
              <div>{term.url}</div>
              <div>{moment(term.createdAt).format('YYYY-MM-DD HH:mm')}</div>
              <ListActionContainer>
                <OutlineButton
                  variant="danger"
                  onClick={() => deleteTerms(term.id)}
                >
                  Delete
                </OutlineButton>
              </ListActionContainer>
            </ListRow>
          );
        })}
        {!state.isLoading && !state.terms.length && (
          <CenteredContainer>
            <H4>There are no terms</H4>
          </CenteredContainer>
        )}
        {state.isLoading && (
          <CenteredContainer>
            <Loader />
          </CenteredContainer>
        )}
      </ListContainer>
      <Button as={Link} variant="primary" to="/admin/other/terms/create">
        Create Terms
      </Button>
    </div>
  );
}

export default observer(Terms);
