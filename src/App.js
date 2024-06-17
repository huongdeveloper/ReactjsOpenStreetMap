import React from 'react';
import './App.css';
import Map from './components/OpenstreetMaps';
import HeaderMap from './components/HeaderOpenstreetMaps';

function App() {
  return (
    <div className="App">
      <HeaderMap />
      <Map />
    </div>
  );
}

export default App;
