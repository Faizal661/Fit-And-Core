import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserLogin from './pages/auth/UserLogin';
import TrainerLogin from './pages/auth/TrainerLogin';
import AdminLogin from './pages/auth/AdminLogin';
import UserSignUp from './pages/auth/UserSignUp';
import Home from './pages/user/Home';
import Footer from './components/shared/footer';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/trainer/login" element={<TrainerLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/signup" element={<UserSignUp />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
