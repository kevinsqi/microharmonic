import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

class Header extends React.Component {
  render() {
    return (
      <nav
        className={classNames(
          'navbar',
          'navbar-dark',
          'bg-primary',
        )}
      >
        <div className="container">
          <div className="flex-1">
            <a className="navbar-brand" href="/">Microharmonic</a>
            <small className="text-light">A web microtone keyboard</small>
          </div>
          <ul className="navbar-nav">
            <li>
              <NavLink
                className="nav-link"
                to="/tutorial"
              >
                Tutorial
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
