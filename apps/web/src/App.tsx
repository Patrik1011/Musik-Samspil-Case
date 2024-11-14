import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "./Routes";
import { Footer } from "./components/unauthenticated/footer/Footer.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <RoutesComponent />
      <Footer />
    </Router>
  );
};

export default App;
