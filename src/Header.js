import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

class Header extends React.Component {
  render() {
    return (
      <nav
        className="bg-blue d-flex align-items-end pb-3"
        style={{
          height: '150px',
        }}
      >
        <div className="container">
          <div className="d-flex">
            <div className="mr-auto line-height-1">
              <NavLink className="text-5 text-white font-weight-bold" to="/">Microharmonic</NavLink>
              <div className="mt-1">
                <small className="text-light">
                  A web microtone keyboard
                </small>
              </div>
            </div>
            <ul className="list-unstyled m-0">
              <li>
                <NavLink
                  className="btn btn-outline-light btn-lg text-left line-height-1"
                  to="/tutorial"
                >
                  <div className="text-1">New to microtones?</div>
                  <div className="mt-1">Tutorial</div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
