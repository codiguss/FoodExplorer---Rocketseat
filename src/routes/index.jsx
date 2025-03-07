import { BrowserRouter } from "react-router-dom";
import { useAuth } from '../hooks/auth';

import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const { user, isUserAuthenticated } = useAuth();
  const isAdmin = user?.is_admin || false;
  const isAuthenticated = isUserAuthenticated();

  return (
    <BrowserRouter>
      {isAuthenticated ? <AppRoutes isAdmin={isAdmin} /> : <AuthRoutes />}
    </BrowserRouter>
  );
}