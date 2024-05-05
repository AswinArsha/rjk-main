import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import LoginPage from "./LoginPage";
import PointsTable from "./PointsTable";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <div className="App">
        {authenticated ? (
          <PointsTable isAdmin={isAdmin} />
        ) : (
          <LoginPage
            setAuthenticated={setAuthenticated}
            setIsAdmin={setIsAdmin}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
