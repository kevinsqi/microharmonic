import React from 'react';
import classNames from 'classnames';

class Footer extends React.Component {
  render() {
    return (
      <footer
        className={classNames(
          'd-flex align-items-end bg-gray',
          this.props.className,
        )}
      >
        <div className="container">
          <div className="d-flex text-light mt4 mb1">
            <div className="mr-auto">
              Built by <a className="text-light" href="http://www.kevinqi.com/">Kevin Qi</a>
            </div>
            <div>
              <a className="text-light" href="https://github.com/iqnivek/microharmonic/">
                View source on Github
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
