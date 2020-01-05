import React from 'react';
import ReactModal from 'react-modal';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import debounce from 'debounce';

import { get } from '../../util/fetch';
import Autosuggest from '../autosuggest';
import { Button } from '../button';

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return <span>{suggestion.name}</span>;
}

async function getSuggestions(value) {
  if (value.trim() === '') {
    return [];
  }

  const { data } = await get('/api/geo/places/search', { q: value.trim() });

  return data;
}

class PlaceLookupModal extends React.Component {
  observableState = observable({
    value: '',
    suggestions: [],
  });

  onChange = (event, { newValue }) => {
    this.observableState.value = newValue;
  };

  onFetch = async ({ value }) => {
    this.observableState.suggestions = await getSuggestions(value);
  };

  debouncedFetch = debounce(this.onFetch, 300);

  onClear = () => {
    this.observableState.suggestions = [];
  };

  onSelect = (event, { suggestion }) => {
    if (!this.props.onSelected) {
      this.props.onSelect(suggestion);
      this.observableState.value = '';
      this.observableState.suggestions = [];
    }
  };

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        style={{
          overlay: { zIndex: 10 },
          content: {
            left: '25%',
            right: '25%',
          },
        }}
        onRequestClose={this.props.onClose}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Autosuggest
            placeholder="Enter a name to search"
            value={this.observableState.value}
            onChange={this.onChange}
            suggestions={this.observableState.suggestions}
            renderSuggestion={renderSuggestion}
            getSuggestionValue={getSuggestionValue}
            onFetch={this.debouncedFetch}
            onClear={this.onClear}
            onSelected={this.onSelect}
            innerRef={this.props.autosuggestRef}
          />
          <div style={{ marginTop: 8 }}>
            <Button variant="danger" onClick={this.props.onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </ReactModal>
    );
  }
}

export default observer(PlaceLookupModal);
