import React, { useRef } from 'react';

function FileSelectButton({ onSelect }) {
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
      <button onClick={onClick}>Upload File</button>
      <input
        ref={imageInputRef}
        type="file"
        style={{ display: 'none' }}
        value=""
        onChange={onSelectFiles}
        multiple
        accept=".jpeg,.jpg,.png"
      />
    </>
  );
}

export default FileSelectButton;
