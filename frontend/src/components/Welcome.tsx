import { useAuth } from './navigation/AuthContext';

function Welcome() {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="welcome-message">
        <h1>Welcome{user ? `, ${user.email}` : ''}!</h1>
        <p>You have successfully logged in.</p>
      </div>
    </div>
  );
}

export default Welcome;