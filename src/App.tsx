import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/home/Home';
import Contato from './pages/contato/Contato';
import ScrollExpandIntro from './components/scrollexpand/ScrollExpandIntro';
import Coberturas from './pages/cobertura/Cobertura';
import Servicos from './pages/servicos/Servicos';
import Login from './pages/login/Login';
import Cadastro from './pages/cadastro/Cadastro';
import ListagemApolices from './pages/apolices/ListagemApolices';
import ProtectedRoute from './components/route/ProtectedRoute';
import DashboardCliente from './pages/dashboard/DashboardCliente';
import DashboardCorretor from './pages/dashboard/DashboardCorretor';
import ChatbotFlutuante from './components/chatbot/ChatbotFlutuante';
import AreaCorretor from './pages/corretor/AreaCorretor';

function DashboardRedirect() {
  const perfil = localStorage.getItem('perfil');
  if (perfil === 'ROLE_CORRETOR') {
    return <Navigate to="/dashboard/corretor" replace />;
  }
  return <Navigate to="/dashboard/cliente" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <ChatbotFlutuante />
        <Routes>
          <Route
            path="/"
            element={
              <ScrollExpandIntro>
                <Home />
              </ScrollExpandIntro>
            }
          />
          
          <Route
            path="/home"
            element={
              <ScrollExpandIntro>
                <Home />
              </ScrollExpandIntro>
            }
          />

          <Route path="/contato" element={<Contato />} />
          <Route path="/coberturas" element={<Coberturas />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          
          {/* Rotas Protegidas com RBAC */}
          <Route
            path="/apolices"
            element={
              <ProtectedRoute>
                <ListagemApolices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/cliente"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CLIENTE']}>
                <DashboardCliente />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/corretor"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CORRETOR']}>
                <DashboardCorretor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/corretor/apolices"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CORRETOR']}>
                <AreaCorretor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;