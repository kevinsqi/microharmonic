import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer className={`bg-dark py-3 ${this.props.className}`}>
        <div className="container">
          <div className="text-light">
            <div>Built by <a href="http://www.kevinqi.com/">Kevin Qi</a></div>
            <div><a href="https://github.com/iqnivek/microharmonic/">View source on Github</a></div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
