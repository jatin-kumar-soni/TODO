import { Link, Navigate, Outlet, useLocation, useNavigate, useRoutes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useAuthGuard } from "./hooks/useAuthGuard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import TodoPage from "./pages/TodoPage";

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
};

const AppShell = () => {
  const { user, clear } = useAuthStore((state) => ({
    user: state.user,
    clear: state.clear
  }));
  const navigate = useNavigate();

  const handleLogout = () => {
    clear();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/todos" className="logo">
          Todo List
        </Link>
        <nav className="nav-links">
          {user ? (
            <>
              <span className="user-chip">{user.name}</span>
              <button type="button" onClick={handleLogout} className="ghost-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  const token = useAuthStore((state) => state.token);
  useAuthGuard();

  const element = useRoutes([
    {
      element: <AppShell />,
      children: [
        {
          path: "/",
          element: token ? <Navigate to="/todos" replace /> : <Navigate to="/login" replace />
        },
        {
          path: "/login",
          element: token ? <Navigate to="/todos" replace /> : <LoginPage />
        },
        {
          path: "/signup",
          element: token ? <Navigate to="/todos" replace /> : <SignupPage />
        },
        {
          path: "/forgot-password",
          element: <ForgotPasswordPage />
        },
        {
          path: "/reset-password",
          element: <ResetPasswordPage />
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "/todos",
              element: <TodoPage />
            }
          ]
        },
        {
          path: "*",
          element: <Navigate to="/" replace />
        }
      ]
    }
  ]);

  return element;
};

export default App;

