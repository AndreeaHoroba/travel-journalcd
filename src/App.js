import React, { useContext, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { AuthContext } from './auth/AuthContext';
import Login from './auth/Login';
import EditEntry from './components/EditEntry';
import CreateEntry from './pages/CreateEntry';
import Dashboard from './pages/Dashboard';
import EntryDetail from './pages/EntryDetail';


function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      <Navigate to="/dashboard" />;
    }
  }, [user]);

  return (
    <Router>
      {/* <div className="App">
        <header className="App-header">
          <img src="/planet-earth-9324.png" className="App-logo" alt="logo" />
          
          <div className="login-container">
            <div className="login-box"> */}
              <Routes>
                {/* If user is logged in, redirect to Dashboard */}
                <Route
                  index
                  element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
                />
                {/* Login Route */}
                <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                {/* Dashboard Route */}
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                {/* Create Entry Route */}
                <Route path="/create-entry" element={user ? <CreateEntry /> : <Navigate to="/login" />} />
                <Route path="/entry/:entryId" element={<EntryDetail />} /> 
                <Route path="/add-entry" element={<CreateEntry />} />
                <Route path="/login" element={<Login />} />
                <Route path="/edit/:entryId" element={<EditEntry />} />



              </Routes>
            {/* </div>
          </div>
        </header>
      </div> */}
    </Router>
  );
}

export default App;
