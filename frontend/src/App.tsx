import { HashRouter, Routes, Route } from 'react-router-dom';
import type { AuthUser } from '@ai-coding/shared-types';
import Login from './components/Login';
import Welcome from './components/Welcome';
import './App.css';

function App() {
  // Get user from sessionStorage if available
  const getCurrentUser = (): AuthUser | undefined => {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr) as AuthUser;
      } catch {
        return undefined;
      }
    }
    return undefined;
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<Welcome user={getCurrentUser()} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;