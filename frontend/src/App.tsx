import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/navigation/AuthContext';
import Navigation from './components/navigation/Navigation';
import ProtectedRoute from './components/navigation/ProtectedRoute';
import Login from './components/Login';
import Welcome from './components/Welcome';
import Products from './pages/Products';
import NotFound from './pages/NotFound';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navigation />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <>
                <NotFound />
              </>
            ) : (
              <Login />
            )
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename="/ai-coding-as-a-blackbox">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;