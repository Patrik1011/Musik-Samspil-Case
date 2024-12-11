import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "./routes/Routes";
import { Layout } from "./Layout";
import { checkSession } from "./utils/token.ts";

const App: React.FC = () => {
  useEffect(() => {
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Layout>
        <RoutesComponent />
      </Layout>
    </Router>
  );
};

export default App;
