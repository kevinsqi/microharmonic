import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

function NavButton(props) {
  return (
    <NavLink
      className="btn btn-outline-light btn-lg text-left line-height-1 opacity-60"
      activeClassName="opacity-100"
      to={props.to}
      exact
    >
      <div className="text-1">{props.subtitle}</div>
      <div className="mt-1">{props.title}</div>
    </NavLink>
  );
}

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
            <ul className="list-inline list-unstyled m-0">
              <li className="list-inline-item">
                <NavButton
                  to="/tutorial"
                  title="Tutorial"
                  subtitle="New to microtones?"
                />
              </li>
              <li className="list-inline-item">
                <NavButton
                  to="/"
                  title="Keyboard"
                  subtitle="Explore"
                />
              </li>
              <li className="list-inline-item">
                <NavButton
                  to="/composer"
                  title="Composer"
                  subtitle="Write"
                />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
