import React, { useRef } from 'react';

import { OutlineButton } from './button';

function FileSelectButton({
  multiple = false,
  children,
  onSelect,
  accept = ['.jpeg', '.jpg', '.png'],
  ...props
}) {
  const imageInputRef = useRef();

  const onClick = () => {
    if (imageInputRef) {
      imageInputRef.current.click(undefined);
    }
  };

  const onSelectFiles = event => {
    onSelect(event.target.files);
  };

  return (
    <>
      <OutlineButton type="button" {...props} onClick={onClick}>
        {children}
      </OutlineButton>
      <input
        ref={imageInputRef}
        type="file"
        style={{ display: 'none' }}
        value=""
        onChange={onSelectFiles}
        multiple={multiple}
        accept={accept.join(',')}
      />
    </>
  );
}

export default FileSelectButton;
