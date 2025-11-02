import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import EditEntry from './components/EditEntry';
import BookingsPage from './pages/BookingsPage';
import CreateEntry from './pages/CreateEntry';
import Dashboard from './pages/Dashboard';
import EntryDetail from './pages/EntryDetail';
import ExpensesPage from './pages/ExpensesPage';
import RecommendationsPage from './pages/RecommendationsPage';
import WishlistPage from './pages/WishlistPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Dashboard />} />

        {/* Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-entry" element={<CreateEntry />} />
        <Route path="/edit/:entryId" element={<EditEntry />} />
        <Route path="/entry/:entryId" element={<EntryDetail />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />

      </Routes>
    </Router>
  );
}

export default App;
