import type { AuthUser } from '@ai-coding/shared-types';

interface WelcomeProps {
  user?: AuthUser;
}

function Welcome({ user }: WelcomeProps) {
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