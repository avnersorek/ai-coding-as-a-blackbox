export interface NavigationItem {
  label: string;
  path: string;
  key: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (user: any) => void;
  logout: () => void;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}