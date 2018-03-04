import React from 'react';

function Label(props) {
  return (
    <label>
      <small className="font-weight-bold text-muted uppercase">
        {props.children}
      </small>
    </label>
  );
}

export default Label;
