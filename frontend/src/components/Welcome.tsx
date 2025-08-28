import { useEffect, useState } from 'react';
import type { AuthUser } from '@ai-coding/shared-types';

interface WelcomeProps {
  user?: AuthUser;
}

function Welcome({ user }: WelcomeProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | undefined>(user);

  useEffect(() => {
    // Try to get user from sessionStorage if not provided via props
    if (!currentUser) {
      const userStr = sessionStorage.getItem('currentUser');
      if (userStr) {
        try {
          const sessionUser = JSON.parse(userStr) as AuthUser;
          setCurrentUser(sessionUser);
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [currentUser]);

  return (
    <div className="container">
      <div className="welcome-message">
        <h1>Welcome{currentUser ? `, ${currentUser.email}` : ''}!</h1>
        <p>You have successfully logged in.</p>
      </div>
    </div>
  );
}

export default Welcome;