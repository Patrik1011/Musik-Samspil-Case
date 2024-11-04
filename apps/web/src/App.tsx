// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from './routes/Routes';
import ProtectedRoute from './routes/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          route.protected ? (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedRoute><route.component /></ProtectedRoute>}
            />
          ) : (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          )
        ))}
      </Routes>
    </Router>
  );
};

export default App;
