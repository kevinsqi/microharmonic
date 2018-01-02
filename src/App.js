import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './AppContent';
import Footer from './Footer';
import Header from './Header';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
          <AppContent />
          <Footer className="mt-3" />
        </div>
      </Router>
    );
  }
}

export default App;
