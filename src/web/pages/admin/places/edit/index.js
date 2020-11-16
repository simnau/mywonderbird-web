import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import CreateEditPlace from '../components/create-edit-place';

function EditPlace() {
  const {
    params: { id },
  } = useRouteMatch();

  return <CreateEditPlace id={id} />;
}

export default EditPlace;
