import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import RoutesComponent from './Routes';

const App: React.FC = () => {
  return (
    <Router>
      <RoutesComponent />
    </Router>
  );
};

export default App;
