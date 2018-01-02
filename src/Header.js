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
            <span className="text-light">A web microtone keyboard</span>
          </div>
          <ul className="navbar-nav">
            <li>
              <NavLink
                className="nav-link"
                to="/"
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
