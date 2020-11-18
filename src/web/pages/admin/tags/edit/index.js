import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import CreateEditTag from '../components/create-edit-tag';

function EditTag() {
  const {
    params: { id },
  } = useRouteMatch();

  return <CreateEditTag id={id} />;
}

export default EditTag;
