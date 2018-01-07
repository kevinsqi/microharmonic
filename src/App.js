import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
} from 'react-router-dom';
import './App.css';
import AppContent from './AppContent'; // noreintegrate rename Keyboard, Composer
import Footer from './Footer';
import Header from './Header';
import Tutorial from './Tutorial';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
          <Route exact path="/" component={AppContent} />
          <Route exact path="/tutorial" component={Tutorial} />
          <Footer className="mt-3" />
        </div>
      </Router>
    );
  }
}

export default App;
