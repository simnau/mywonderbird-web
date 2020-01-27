import React from 'react';
import LoaderSpinner from 'react-loader-spinner';

import * as colors from '../constants/colors';

function Loader({
  type = 'Oval',
  color = colors.primary,
  height = 64,
  width = 64,
  ...props
}) {
  return (
    <LoaderSpinner
      {...props}
      type={type}
      color={color}
      height={height}
      width={width}
      {...props}
    />
  );
}

export default Loader;
