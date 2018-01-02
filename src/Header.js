import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <h1>Microharmonic</h1>
        <div>A web microtone keyboard</div>
      </div>
    );
  }
}

export default Header;
