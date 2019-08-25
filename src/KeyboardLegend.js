import React from 'react';
import classNames from 'classnames';

function KeyboardLegend({ className }) {
  return (
    <div className={classNames('d-flex opacity-80', className)}>
      <div style={{ width: 60 }}>
        <button className="Key">
          <div className="Key__note">4</div>
          <div className="Key__cents small">150</div>
          <div className="Key__shortcut small">v</div>
        </button>
      </div>

      <div className="ml-4 mt-1">
        <div className="Key__note">Note number</div>
        <div className="Key__cents small">Cent value</div>
        <div className="Key__shortcut bg-white small">Keyboard shortcut</div>
      </div>
    </div>
  );
}

export default KeyboardLegend;
