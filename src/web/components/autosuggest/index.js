import React from 'react';
import ReactAutosuggest from 'react-autosuggest';

import './index.css';

function Autosuggest({
  value,
  onChange,
  placeholder = 'Enter a term to search',
  suggestions,
  renderSuggestion,
  onFetch,
  onClear,
  getSuggestionValue,
  onSelected,
  innerRef,
}) {
  return (
    <ReactAutosuggest
      inputProps={{
        value,
        onChange,
        placeholder,
      }}
      suggestions={suggestions}
      renderSuggestion={renderSuggestion}
      onSuggestionsFetchRequested={onFetch}
      onSuggestionsClearRequested={onClear}
      onSuggestionSelected={onSelected}
      getSuggestionValue={getSuggestionValue}
      ref={innerRef}
    />
  );
}

export default Autosuggest;
