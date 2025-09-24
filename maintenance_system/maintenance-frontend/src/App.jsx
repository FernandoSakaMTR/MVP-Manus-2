import { BrowserRouter, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MaintenanceForm from './components/MaintenanceForm';
import MaintenanceList from './components/MaintenanceList';
import MaintenanceExecution from './components/MaintenanceExecution';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './utils/ProtectedRoute';
import { Button } from './components/ui/button';
import { LogOut } from 'lucide-react';

// Layout component to house the shared navigation and structure
const AppLayout = () => {
  const { user, logoutUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            Sistema de Manutenção
          </Link>
          <div className="flex items-center space-x-4">
            {/* Conditional Navigation */}
            {user?.role === 'operator' && (
              <Button asChild variant="ghost">
                <Link to="/request">Nova Requisição</Link>
              </Button>
            )}
            {user?.role === 'maintenance' && (
              <Button asChild variant="ghost">
                <Link to="/manutencao">Painel de Manutenção</Link>
              </Button>
            )}
            <Button onClick={logoutUser} variant="destructive" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </nav>
      </header>
      <main>
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
};


function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Default route after login depends on role */}
            <Route path="/" element={
              user?.role === 'maintenance' ? <Navigate to="/manutencao" /> : <Navigate to="/request" />
            } />
            <Route path="/request" element={<MaintenanceForm />} />
            <Route path="/manutencao" element={<MaintenanceList />} />
            <Route path="/manutencao/:id" element={<MaintenanceExecution />} />
          </Route>
        </Route>

        {/* Fallback route if none of the above match */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
