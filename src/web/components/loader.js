import React from 'react';
import Loader from 'react-loader-spinner';

import * as colors from '../constants/colors';

function CustomLoader({
  type = 'Oval',
  color = colors.primary,
  height = 64,
  width = 64,
  ...props
}) {
  return (
    <Loader
      {...props}
      type={type}
      color={color}
      height={height}
      width={width}
      {...props}
    />
  );
}

export default CustomLoader;
