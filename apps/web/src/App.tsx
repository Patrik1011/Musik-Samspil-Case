import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "./Routes";
import { Footer } from "./components/unauthenticated/footer/Footer.tsx";
import Navigation from "./components/navigation/Navigation.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <RoutesComponent />
      <Footer />
    </Router>
  );
};

export default App;
