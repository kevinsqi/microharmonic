import React from 'react';
import ReactDOM from 'react-dom';

// App
import App from './App';

// Styling
import 'typeface-inter';
import './index.css';

// Analytics
import ReactGA from 'react-ga';
ReactGA.initialize('UA-145919044-1');

ReactDOM.render(<App />, document.getElementById('root'));
