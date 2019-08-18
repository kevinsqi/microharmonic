import React from 'react';
import classNames from 'classnames';

class Footer extends React.Component {
  render() {
    return (
      <footer className={classNames('d-flex align-items-end', this.props.className)}>
        <div className="container text-center small my-5">
          <div>
            Built by <a href="https://www.kevinqi.com/">@kevinsqi</a>
          </div>
          <div>
            <a href="https://github.com/kevinsqi/microharmonic/">View source on Github</a>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
