import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer className={this.props.className}>
        <div>
          Built by <a href="http://www.kevinqi.com/">Kevin Qi</a>.
          <a href="https://github.com/iqnivek/microharmonic/">View source on Github</a>
        </div>
      </footer>
    );
  }
}

export default Footer;
